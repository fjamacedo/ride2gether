'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const esquemaRegisto = z.object({
  nome: z.string().min(2, 'Indica o teu nome'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A password deve ter pelo menos 8 caracteres'),
  tipo_perfil: z.enum(['direccao_clube', 'socio', 'independente']),
})

export interface EstadoFormulario {
  erro?: string
  mensagem?: string
}

export async function registar(
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const dados = esquemaRegisto.safeParse({
    nome: formData.get('nome'),
    email: formData.get('email'),
    password: formData.get('password'),
    tipo_perfil: formData.get('tipo_perfil'),
  })

  if (!dados.success) {
    return { erro: dados.error.issues[0]?.message ?? 'Dados inválidos' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: dados.data.email,
    password: dados.data.password,
    options: {
      data: { nome: dados.data.nome, tipo_perfil: dados.data.tipo_perfil },
    },
  })

  if (error) {
    return { erro: error.message }
  }

  // Sem sessão devolvida = confirmação de e-mail obrigatória (definição por
  // omissão da Supabase); com auto-confirm activo, já vem sessão e entra logo.
  if (!data.session) {
    return {
      mensagem: `Conta criada. Enviámos um e-mail de confirmação para ${dados.data.email} — confirma antes de entrares (verifica também a pasta de spam/lixo).`,
    }
  }

  redirect('/passeios')
}

const esquemaLogin = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Indica a password'),
})

export async function login(
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const dados = esquemaLogin.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!dados.success) {
    return { erro: dados.error.issues[0]?.message ?? 'Dados inválidos' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(dados.data)

  if (error) {
    return { erro: 'Credenciais inválidas' }
  }

  redirect('/passeios')
}

const esquemaRecuperarPassword = z.object({
  email: z.string().email('E-mail inválido'),
})

export async function pedirRecuperacaoPassword(
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const dados = esquemaRecuperarPassword.safeParse({ email: formData.get('email') })
  if (!dados.success) {
    return { erro: dados.error.issues[0]?.message ?? 'Dados inválidos' }
  }

  const host = (await headers()).get('host')
  const supabase = await createClient()

  // O resultado é sempre a mesma mensagem, exista ou não conta com este
  // e-mail — evita revelar a terceiros que e-mails estão registados.
  await supabase.auth.resetPasswordForEmail(dados.data.email, {
    redirectTo: `https://${host}/redefinir-password`,
  })

  return {
    mensagem:
      'Se existir uma conta com esse e-mail, enviámos um link para redefinires a password (verifica também o spam/lixo).',
  }
}

export async function terminarSessao() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
