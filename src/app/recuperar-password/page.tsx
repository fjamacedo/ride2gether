'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { pedirRecuperacaoPassword, type EstadoFormulario } from '@/lib/auth/actions'

const estadoInicial: EstadoFormulario = {}

export default function PaginaRecuperarPassword() {
  const [estado, formAction, aPendente] = useActionState(pedirRecuperacaoPassword, estadoInicial)

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-2xl font-bold">Recuperar password</h1>
        <p className="text-sm text-neutral-600">
          Indica o e-mail da tua conta e enviamos-te um link para definires uma nova password.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          E-mail
          <input name="email" type="email" required className="rounded border px-3 py-2" />
        </label>

        {estado.erro && <p className="text-sm text-red-600">{estado.erro}</p>}
        {estado.mensagem && <p className="text-sm text-green-700">{estado.mensagem}</p>}

        <button
          type="submit"
          disabled={aPendente}
          className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
        >
          {aPendente ? 'A enviar…' : 'Enviar link'}
        </button>
      </form>

      <p className="text-sm">
        <Link href="/login" className="underline">
          Voltar ao login
        </Link>
      </p>
    </main>
  )
}
