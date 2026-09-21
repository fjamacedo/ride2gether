'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { EmailOtpType } from '@supabase/supabase-js'
import { AuthShell } from '@/components/AuthShell'
import { Logo } from '@/components/Logo'

function ConteudoConfirmacao() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [aConfirmar, setAConfirmar] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  if (!tokenHash || !type) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo tamanho="sm" />
        <h1 className="text-xl font-bold text-neutral-900">Link inválido</h1>
        <p className="text-sm text-neutral-600">
          Este link está incompleto ou corrompido. Pede um novo.
        </p>
        <Link href="/recuperar-password" className="text-ride-green underline underline-offset-2">
          Pedir novo link
        </Link>
      </div>
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
    <div className="flex flex-col items-center gap-4 text-center">
      <Logo tamanho="sm" />
      <h1 className="text-xl font-bold text-neutral-900">Confirmar</h1>
      <p className="text-sm text-neutral-600">
        Por segurança, confirma que foste tu que pediste isto clicando no botão abaixo.
      </p>

      {erro && (
        <div className="text-sm text-ride-red">
          <p>{erro}</p>
          <Link href="/recuperar-password" className="text-ride-green underline underline-offset-2">
            Pedir novo link
          </Link>
        </div>
      )}

      <button
        onClick={confirmar}
        disabled={aConfirmar}
        className="rounded bg-ride-green px-4 py-2 font-medium text-white transition hover:bg-ride-green-dark disabled:opacity-50"
      >
        {aConfirmar ? 'A confirmar…' : 'Confirmar'}
      </button>
    </div>
  )
}

export default function PaginaConfirmarLink() {
  return (
    <AuthShell>
      <Suspense fallback={<p className="text-center text-sm text-neutral-500">A carregar…</p>}>
        <ConteudoConfirmacao />
      </Suspense>
    </AuthShell>
  )
}
