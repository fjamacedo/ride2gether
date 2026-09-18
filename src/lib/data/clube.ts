'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { EstadoFormulario } from '@/lib/auth/actions'

export async function obterUtilizadorAutenticado() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function obterClubeQueDirijo() {
  const supabase = await createClient()
  const user = await obterUtilizadorAutenticado()
  if (!user) return null

  const { data } = await supabase
    .from('clubes')
    .select('*')
    .eq('responsavel_id', user.id)
    .maybeSingle()

  return data
}

const esquemaClube = z.object({
  nome: z.string().min(2, 'Indica o nome do clube'),
  localizacao: z.string().optional(),
  nif: z.string().min(9, 'NIF inválido').max(9, 'NIF inválido'),
})

export async function registarClube(
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const user = await obterUtilizadorAutenticado()
  if (!user) return { erro: 'Sessão expirada, entra novamente.' }

  const dados = esquemaClube.safeParse({
    nome: formData.get('nome'),
    localizacao: formData.get('localizacao'),
    nif: formData.get('nif'),
  })
  if (!dados.success) {
    return { erro: dados.error.issues[0]?.message ?? 'Dados inválidos' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('clubes').insert({
    nome: dados.data.nome,
    localizacao: dados.data.localizacao || null,
    nif: dados.data.nif,
    responsavel_id: user.id,
  })

  if (error) {
    return { erro: error.code === '23505' ? 'Já existe um clube com este NIF.' : error.message }
  }

  await supabase
    .from('perfis')
    .update({ tipo_perfil: 'direccao_clube' })
    .eq('id', user.id)

  revalidatePath('/dashboard')
  return {}
}

export async function listarSocios(clubeId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('clube_membros')
    .select('utilizador_id, estado, data_adesao, perfis:utilizador_id(id, nome, contacto)')
    .eq('clube_id', clubeId)
    .order('data_adesao', { ascending: false })

  return data ?? []
}

export async function adicionarSocioPorEmail(clubeId: string, formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  if (!email) return { erro: 'Indica o e-mail do sócio' }

  const supabase = await createClient()

  // O sócio tem de já se ter registado na plataforma (fluxo da secção 3.2);
  // a procura usa a função procurar_perfil_por_email (ver migration 0001),
  // que evita expor o e-mail de todos os utilizadores via select directo.
  const { data: resultados } = await supabase.rpc('procurar_perfil_por_email', {
    p_email: email,
  })
  const perfil = resultados?.[0]

  if (!perfil) {
    return {
      erro:
        'Não encontrámos essa pessoa na plataforma. Na Fase 1, o sócio tem de se registar primeiro e associar-se ao clube pela app.',
    }
  }

  const { error } = await supabase
    .from('clube_membros')
    .insert({ clube_id: clubeId, utilizador_id: perfil.id, estado: 'activo' })

  if (error) return { erro: error.message }

  revalidatePath('/dashboard/socios')
  return {}
}

export async function actualizarEstadoSocio(
  clubeId: string,
  utilizadorId: string,
  estado: 'activo' | 'inactivo'
) {
  const supabase = await createClient()
  await supabase
    .from('clube_membros')
    .update({ estado })
    .eq('clube_id', clubeId)
    .eq('utilizador_id', utilizadorId)

  revalidatePath('/dashboard/socios')
}

export async function removerSocio(clubeId: string, utilizadorId: string) {
  const supabase = await createClient()
  await supabase
    .from('clube_membros')
    .delete()
    .eq('clube_id', clubeId)
    .eq('utilizador_id', utilizadorId)

  revalidatePath('/dashboard/socios')
}
