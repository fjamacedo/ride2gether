'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { pedirRecuperacaoPassword, type EstadoFormulario } from '@/lib/auth/actions'
import { AuthShell } from '@/components/AuthShell'
import { Logo } from '@/components/Logo'

const estadoInicial: EstadoFormulario = {}

export default function PaginaRecuperarPassword() {
  const [estado, formAction, aPendente] = useActionState(pedirRecuperacaoPassword, estadoInicial)

  return (
    <AuthShell>
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <Logo tamanho="sm" />
        <h1 className="text-xl font-bold text-neutral-900">Recuperar password</h1>
        <p className="text-sm text-neutral-600">
          Indica o e-mail da tua conta e enviamos-te um link para definires uma nova password.
        </p>
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

        {estado.erro && <p className="text-sm text-ride-red">{estado.erro}</p>}
        {estado.mensagem && <p className="text-sm text-ride-green-dark">{estado.mensagem}</p>}

        <button
          type="submit"
          disabled={aPendente}
          className="rounded bg-ride-green px-3 py-2 font-medium text-white transition hover:bg-ride-green-dark disabled:opacity-50"
        >
          {aPendente ? 'A enviar…' : 'Enviar link'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        <Link href="/login" className="text-ride-green underline underline-offset-2">
          Voltar ao login
        </Link>
      </p>
    </AuthShell>
  )
}
