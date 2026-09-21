'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login, type EstadoFormulario } from '@/lib/auth/actions'

const estadoInicial: EstadoFormulario = {}

export default function PaginaLogin() {
  const [estado, formAction, aPendente] = useActionState(login, estadoInicial)

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-2xl font-bold">Entrar</h1>
        <p className="text-sm text-neutral-600">Ride2gether</p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          E-mail
          <input name="email" type="email" required className="rounded border px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Password
          <input name="password" type="password" required className="rounded border px-3 py-2" />
        </label>

        <Link href="/recuperar-password" className="-mt-2 text-xs underline self-start">
          Esqueceste a password?
        </Link>

        {estado.erro && (
          <div className="text-sm text-red-600">
            <p>{estado.erro}</p>
            <p className="mt-1 text-xs text-neutral-500">
              Se acabaste de te registares, confirma primeiro o e-mail que te enviámos.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={aPendente}
          className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
        >
          {aPendente ? 'A entrar…' : 'Entrar'}
        </button>
      </form>

      <p className="text-sm">
        Ainda não tens conta?{' '}
        <Link href="/registo" className="underline">
          Criar conta
        </Link>
      </p>
    </main>
  )
}
