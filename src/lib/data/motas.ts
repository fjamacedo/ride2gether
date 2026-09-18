'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { obterUtilizadorAutenticado } from '@/lib/data/clube'
import type { EstadoFormulario } from '@/lib/auth/actions'

export async function listarMinhasMotas() {
  const user = await obterUtilizadorAutenticado()
  if (!user) return []

  const supabase = await createClient()
  const { data } = await supabase
    .from('motas')
    .select('*')
    .eq('utilizador_id', user.id)
    .order('created_at', { ascending: true })

  return data ?? []
}

const esquemaMota = z.object({
  marca: z.string().min(1, 'Indica a marca'),
  modelo: z.string().optional(),
  ano: z.string().optional(),
  cilindrada_cc: z.string().optional(),
})

function paraInteiroOpcional(valor: string | undefined) {
  if (!valor) return null
  const n = Number(valor)
  return Number.isFinite(n) ? n : null
}

export async function adicionarMota(
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const user = await obterUtilizadorAutenticado()
  if (!user) return { erro: 'Sessão expirada, entra novamente.' }

  const dados = esquemaMota.safeParse({
    marca: formData.get('marca'),
    modelo: formData.get('modelo'),
    ano: formData.get('ano'),
    cilindrada_cc: formData.get('cilindrada_cc'),
  })
  if (!dados.success) {
    return { erro: dados.error.issues[0]?.message ?? 'Dados inválidos' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('motas').insert({
    utilizador_id: user.id,
    marca: dados.data.marca,
    modelo: dados.data.modelo || null,
    ano: paraInteiroOpcional(dados.data.ano),
    cilindrada_cc: paraInteiroOpcional(dados.data.cilindrada_cc),
  })

  if (error) {
    return {
      erro: error.message.includes('até 2 motas')
        ? 'Já tens 2 motas registadas — remove uma antes de adicionar outra.'
        : error.message,
    }
  }

  revalidatePath('/perfil')
  return {}
}

export async function removerMota(motaId: string) {
  const user = await obterUtilizadorAutenticado()
  if (!user) return

  const supabase = await createClient()
  await supabase.from('motas').delete().eq('id', motaId).eq('utilizador_id', user.id)

  revalidatePath('/perfil')
}
