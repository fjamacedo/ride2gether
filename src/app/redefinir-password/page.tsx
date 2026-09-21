'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AuthShell } from '@/components/AuthShell'
import { Logo } from '@/components/Logo'

export default function PaginaRedefinirPassword() {
  const [estadoSessao, setEstadoSessao] = useState<'a_verificar' | 'pronta' | 'invalida'>(
    'a_verificar'
  )
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [aGuardar, setAGuardar] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // O link de recuperação estabelece a sessão a partir de um fragmento da
    // URL (#access_token=...) — o Supabase dispara "PASSWORD_RECOVERY"
    // quando o processa. Também verificamos se já existe sessão, para o
    // caso de o evento ter disparado antes deste efeito correr.
    const { data: subscricao } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === 'PASSWORD_RECOVERY') setEstadoSessao('pronta')
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setEstadoSessao('pronta')
    })

    const temporizador = setTimeout(() => {
      setEstadoSessao((actual) => (actual === 'a_verificar' ? 'invalida' : actual))
    }, 4000)

    return () => {
      subscricao.subscription.unsubscribe()
      clearTimeout(temporizador)
    }
  }, [])

  async function submeter(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setAGuardar(true)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    setAGuardar(false)
    if (error) {
      setErro(error.message)
      return
    }

    router.push('/passeios')
  }

  if (estadoSessao === 'a_verificar') {
    return (
      <AuthShell>
        <p className="text-center text-sm text-neutral-500">A verificar o link…</p>
      </AuthShell>
    )
  }

  if (estadoSessao === 'invalida') {
    return (
      <AuthShell>
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo tamanho="sm" />
          <h1 className="text-xl font-bold text-neutral-900">Link inválido ou expirado</h1>
          <p className="text-sm text-neutral-600">
            Este link de recuperação já não é válido. Pede um novo.
          </p>
          <Link href="/recuperar-password" className="text-ride-green underline underline-offset-2">
            Pedir novo link
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <Logo tamanho="sm" />
        <h1 className="text-xl font-bold text-neutral-900">Definir nova password</h1>
      </div>

      <form onSubmit={submeter} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-neutral-700">
          Nova password
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border border-neutral-300 px-3 py-2 focus:border-ride-green focus:outline-none focus:ring-1 focus:ring-ride-green"
          />
        </label>

        {erro && <p className="text-sm text-ride-red">{erro}</p>}

        <button
          type="submit"
          disabled={aGuardar}
          className="rounded bg-ride-green px-3 py-2 font-medium text-white transition hover:bg-ride-green-dark disabled:opacity-50"
        >
          {aGuardar ? 'A guardar…' : 'Guardar nova password'}
        </button>
      </form>
    </AuthShell>
  )
}
