'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

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
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4">
        <p className="text-sm text-neutral-500">A verificar o link…</p>
      </main>
    )
  }

  if (estadoSessao === 'invalida') {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold">Link inválido ou expirado</h1>
        <p className="text-sm text-neutral-600">
          Este link de recuperação já não é válido. Pede um novo.
        </p>
        <Link href="/recuperar-password" className="underline">
          Pedir novo link
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-4">
      <h1 className="text-2xl font-bold">Definir nova password</h1>

      <form onSubmit={submeter} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Nova password
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border px-3 py-2"
          />
        </label>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={aGuardar}
          className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
        >
          {aGuardar ? 'A guardar…' : 'Guardar nova password'}
        </button>
      </form>
    </main>
  )
}
