import * as Sentry from '@sentry/nextjs'
import { createAdminClient } from '@/lib/supabase/admin'
import { enviarPush } from '@/lib/push/vapid'
import type { Passeio } from '@/lib/types/database'

type ClienteAdmin = ReturnType<typeof createAdminClient>

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Mesma lógica de elegibilidade de listarPasseiosVisiveis() (src/lib/data/passeios.ts),
// aplicada aqui ao universo de todos os utilizadores em vez de um só, para decidir
// quem deve ser notificado da criação do passeio.
async function obterDestinatariosElegiveis(
  supabase: ClienteAdmin,
  passeio: Passeio,
  criadorId: string
): Promise<string[]> {
  if (passeio.ambito_visibilidade === 'privado') {
    if (!passeio.organizador_clube_id) return []

    const { data: membros } = await supabase
      .from('clube_membros')
      .select('utilizador_id')
      .eq('clube_id', passeio.organizador_clube_id)
      .eq('estado', 'activo')

    return (membros ?? []).map((m) => m.utilizador_id).filter((id) => id !== criadorId)
  }

  const [{ data: perfis }, { data: motas }] = await Promise.all([
    supabase.from('perfis').select('id'),
    supabase.from('motas').select('utilizador_id, cilindrada_cc, marca'),
  ])

  if (!perfis) return []

  const motasPorUtilizador = new Map<string, { cilindrada_cc: number | null; marca: string }[]>()
  for (const mota of motas ?? []) {
    const lista = motasPorUtilizador.get(mota.utilizador_id) ?? []
    lista.push(mota)
    motasPorUtilizador.set(mota.utilizador_id, lista)
  }

  const semCriterios =
    passeio.cilindrada_min == null && passeio.cilindrada_max == null && !passeio.marca

  return perfis
    .map((p) => p.id)
    .filter((id) => id !== criadorId)
    .filter((id) => {
      if (semCriterios) return true

      const motasDoUtilizador = motasPorUtilizador.get(id)
      if (!motasDoUtilizador || motasDoUtilizador.length === 0) return true

      return motasDoUtilizador.some((mota) => {
        if (mota.cilindrada_cc != null) {
          if (passeio.cilindrada_min != null && mota.cilindrada_cc < passeio.cilindrada_min)
            return false
          if (passeio.cilindrada_max != null && mota.cilindrada_cc > passeio.cilindrada_max)
            return false
        }
        if (mota.marca && passeio.marca && mota.marca.toLowerCase() !== passeio.marca.toLowerCase()) {
          return false
        }
        return true
      })
    })
}

export async function notificarNovoPasseio(passeio: Passeio, criadorId: string) {
  const supabase = createAdminClient()

  const destinatarios = await obterDestinatariosElegiveis(supabase, passeio, criadorId)
  if (destinatarios.length === 0) {
    Sentry.captureMessage('notificarNovoPasseio: 0 destinatários elegíveis', {
      level: 'info',
      extra: {
        passeioId: passeio.id,
        ambitoVisibilidade: passeio.ambito_visibilidade,
        organizadorClubeId: passeio.organizador_clube_id,
      },
    })
    return
  }

  const { data: subscricoes } = await supabase
    .from('push_subscriptions')
    .select('utilizador_id, endpoint, p256dh, auth')
    .in('utilizador_id', destinatarios)

  if (!subscricoes || subscricoes.length === 0) {
    Sentry.captureMessage('notificarNovoPasseio: destinatários elegíveis sem subscrição push', {
      level: 'info',
      extra: { passeioId: passeio.id, destinatarios },
    })
    return
  }

  const payload = {
    titulo: `Novo passeio: ${passeio.titulo}`,
    corpo: `${passeio.local} · ${formatarData(passeio.data)}`,
    url: `/passeios/${passeio.id}`,
  }

  const registos = await Promise.all(
    subscricoes.map(async (sub) => {
      try {
        await enviarPush(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        )
        return {
          passeio_id: passeio.id,
          destinatario_id: sub.utilizador_id,
          estado_envio: 'enviado' as const,
        }
      } catch (erro) {
        // 404/410 = subscrição expirada ou revogada pelo browser — remover para
        // não voltar a tentar enviar-lhe notificações que vão falhar sempre.
        const codigo = (erro as { statusCode?: number }).statusCode
        if (codigo === 404 || codigo === 410) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
        } else {
          Sentry.captureException(erro, { extra: { passeioId: passeio.id, endpoint: sub.endpoint } })
        }
        return {
          passeio_id: passeio.id,
          destinatario_id: sub.utilizador_id,
          estado_envio: 'falhado' as const,
        }
      }
    })
  )

  await supabase.from('notificacoes').insert(registos)
}
