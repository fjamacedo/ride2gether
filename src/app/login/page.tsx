'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login, type EstadoFormulario } from '@/lib/auth/actions'
import { AuthShell } from '@/components/AuthShell'
import { Logo } from '@/components/Logo'

const estadoInicial: EstadoFormulario = {}

export default function PaginaLogin() {
  const [estado, formAction, aPendente] = useActionState(login, estadoInicial)

  return (
    <AuthShell>
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <Logo tamanho="sm" />
        <h1 className="text-xl font-bold text-neutral-900">Entrar</h1>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-neutral-700">
          E-mail
          <input
            name="email"
            type="email"
            required
            className="rounded border border-neutral-300 px-3 py-2 focus:border-ride-green focus:outline-none focus:ring-1 focus:ring-ride-green"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-neutral-700">
          Password
          <input
            name="password"
            type="password"
            required
            className="rounded border border-neutral-300 px-3 py-2 focus:border-ride-green focus:outline-none focus:ring-1 focus:ring-ride-green"
          />
        </label>

        <Link
          href="/recuperar-password"
          className="-mt-2 self-start text-xs text-ride-green underline underline-offset-2"
        >
          Esqueceste a password?
        </Link>

        {estado.erro && (
          <div className="text-sm text-ride-red">
            <p>{estado.erro}</p>
            <p className="mt-1 text-xs text-neutral-500">
              Se acabaste de te registares, confirma primeiro o e-mail que te enviámos.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={aPendente}
          className="rounded bg-ride-green px-3 py-2 font-medium text-white transition hover:bg-ride-green-dark disabled:opacity-50"
        >
          {aPendente ? 'A entrar…' : 'Entrar'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        Ainda não tens conta?{' '}
        <Link href="/registo" className="text-ride-green underline underline-offset-2">
          Criar conta
        </Link>
      </p>
    </AuthShell>
  )
}
