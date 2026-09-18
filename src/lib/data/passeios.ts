'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { obterUtilizadorAutenticado } from '@/lib/data/clube'
import type { AmbitoVisibilidade, Passeio } from '@/lib/types/database'
import type { EstadoFormulario } from '@/lib/auth/actions'

const esquemaPasseio = z.object({
  titulo: z.string().min(3, 'Indica um título'),
  data: z.string().min(1, 'Indica a data'),
  local: z.string().min(2, 'Indica o ponto de encontro'),
  descricao: z.string().optional(),
  rota: z.string().optional(),
  ambito_visibilidade: z.enum([
    'privado',
    'distrital',
    'regional',
    'nacional',
    'internacional',
    'publico',
  ]),
  max_participantes: z.string().optional(),
  cilindrada_min: z.string().optional(),
  cilindrada_max: z.string().optional(),
  marca: z.string().optional(),
})

function paraInteiroOpcional(valor: string | undefined) {
  if (!valor) return null
  const n = Number(valor)
  return Number.isFinite(n) ? n : null
}

export async function criarPasseio(
  organizador: { clubeId?: string; redirecionarPara: string },
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const user = await obterUtilizadorAutenticado()
  if (!user) return { erro: 'Sessão expirada, entra novamente.' }

  const dados = esquemaPasseio.safeParse({
    titulo: formData.get('titulo'),
    data: formData.get('data'),
    local: formData.get('local'),
    descricao: formData.get('descricao'),
    rota: formData.get('rota'),
    ambito_visibilidade: formData.get('ambito_visibilidade'),
    max_participantes: formData.get('max_participantes'),
    cilindrada_min: formData.get('cilindrada_min'),
    cilindrada_max: formData.get('cilindrada_max'),
    marca: formData.get('marca'),
  })

  if (!dados.success) {
    return { erro: dados.error.issues[0]?.message ?? 'Dados inválidos' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('passeios').insert({
    organizador_clube_id: organizador.clubeId ?? null,
    organizador_utilizador_id: organizador.clubeId ? null : user.id,
    titulo: dados.data.titulo,
    data: new Date(dados.data.data).toISOString(),
    local: dados.data.local,
    descricao: dados.data.descricao || null,
    rota: dados.data.rota || null,
    ambito_visibilidade: dados.data.ambito_visibilidade as AmbitoVisibilidade,
    max_participantes: paraInteiroOpcional(dados.data.max_participantes),
    cilindrada_min: paraInteiroOpcional(dados.data.cilindrada_min),
    cilindrada_max: paraInteiroOpcional(dados.data.cilindrada_max),
    marca: dados.data.marca || null,
  })

  if (error) return { erro: error.message }

  revalidatePath('/passeios')
  if (organizador.clubeId) revalidatePath('/dashboard/passeios')
  redirect(organizador.redirecionarPara)
}

// Nota sobre "elegibilidade" (secção 3.2): os critérios do passeio (cilindrada/marca)
// só filtram quando o perfil do utilizador tem esse dado preenchido — um perfil
// incompleto não é escondido dos passeios, apenas fica sem a validação automática.
export async function listarPasseiosVisiveis() {
  const supabase = await createClient()
  const user = await obterUtilizadorAutenticado()
  if (!user) return []

  const { data: perfil } = await supabase
    .from('perfis')
    .select('cilindrada_cc, marca_moto')
    .eq('id', user.id)
    .maybeSingle()

  const { data: passeios } = await supabase
    .from('passeios')
    .select('*')
    .order('data', { ascending: true })

  if (!passeios) return []

  return (passeios as Passeio[]).filter((p) => {
    if (perfil?.cilindrada_cc != null) {
      if (p.cilindrada_min != null && perfil.cilindrada_cc < p.cilindrada_min) return false
      if (p.cilindrada_max != null && perfil.cilindrada_cc > p.cilindrada_max) return false
    }
    if (perfil?.marca_moto && p.marca && perfil.marca_moto.toLowerCase() !== p.marca.toLowerCase()) {
      return false
    }
    return true
  })
}

export async function listarPasseiosDoClube(clubeId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('passeios')
    .select('*')
    .eq('organizador_clube_id', clubeId)
    .order('data', { ascending: true })

  return data ?? []
}

export async function obterPasseio(id: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('passeios').select('*').eq('id', id).maybeSingle()
  return data
}

export async function listarInscritos(passeioId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('inscricoes')
    .select('id, estado, created_at, perfis:utilizador_id(id, nome, contacto)')
    .eq('passeio_id', passeioId)
    .order('created_at', { ascending: true })

  return data ?? []
}

export async function contarInscritos(passeioId: string) {
  const supabase = await createClient()
  const { count } = await supabase
    .from('inscricoes')
    .select('id', { count: 'exact', head: true })
    .eq('passeio_id', passeioId)

  return count ?? 0
}

export async function obterMinhaInscricao(passeioId: string) {
  const user = await obterUtilizadorAutenticado()
  if (!user) return null

  const supabase = await createClient()
  const { data } = await supabase
    .from('inscricoes')
    .select('*')
    .eq('passeio_id', passeioId)
    .eq('utilizador_id', user.id)
    .maybeSingle()

  return data
}

export async function inscrever(passeioId: string) {
  const user = await obterUtilizadorAutenticado()
  if (!user) return { erro: 'Sessão expirada, entra novamente.' }

  const supabase = await createClient()

  const passeio = await obterPasseio(passeioId)
  if (passeio?.max_participantes != null) {
    const total = await contarInscritos(passeioId)
    if (total >= passeio.max_participantes) {
      return { erro: 'Este passeio já atingiu o número máximo de participantes.' }
    }
  }

  const { error } = await supabase
    .from('inscricoes')
    .insert({ passeio_id: passeioId, utilizador_id: user.id, estado: 'inscrito' })

  if (error) {
    return {
      erro: error.code === '23505' ? 'Já estás inscrito neste passeio.' : error.message,
    }
  }

  revalidatePath(`/passeios/${passeioId}`)
  return {}
}

export async function cancelarInscricao(passeioId: string) {
  const user = await obterUtilizadorAutenticado()
  if (!user) return

  const supabase = await createClient()
  await supabase
    .from('inscricoes')
    .delete()
    .eq('passeio_id', passeioId)
    .eq('utilizador_id', user.id)

  revalidatePath(`/passeios/${passeioId}`)
}
