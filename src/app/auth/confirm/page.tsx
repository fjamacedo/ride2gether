'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { EmailOtpType } from '@supabase/supabase-js'

function ConteudoConfirmacao() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [aConfirmar, setAConfirmar] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  if (!tokenHash || !type) {
    return (
      <>
        <h1 className="text-2xl font-bold">Link inválido</h1>
        <p className="text-sm text-neutral-600">
          Este link está incompleto ou corrompido. Pede um novo.
        </p>
        <Link href="/recuperar-password" className="underline">
          Pedir novo link
        </Link>
      </>
    )
  }

  async function confirmar() {
    setAConfirmar(true)
    setErro(null)

    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash as string,
      type: type as EmailOtpType,
    })

    setAConfirmar(false)
    if (error) {
      setErro('Este link é inválido ou já expirou. Pede um novo.')
      return
    }

    router.push(type === 'recovery' ? '/redefinir-password' : '/passeios')
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Confirmar</h1>
      <p className="text-sm text-neutral-600">
        Por segurança, confirma que foste tu que pediste isto clicando no botão abaixo.
      </p>

      {erro && (
        <div className="text-sm text-red-600">
          <p>{erro}</p>
          <Link href="/recuperar-password" className="underline">
            Pedir novo link
          </Link>
        </div>
      )}

      <button
        onClick={confirmar}
        disabled={aConfirmar}
        className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
      >
        {aConfirmar ? 'A confirmar…' : 'Confirmar'}
      </button>
    </>
  )
}

export default function PaginaConfirmarLink() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-4 px-4">
      <Suspense fallback={<p className="text-sm text-neutral-500">A carregar…</p>}>
        <ConteudoConfirmacao />
      </Suspense>
    </main>
  )
}
