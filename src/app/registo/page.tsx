'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { registar, type EstadoFormulario } from '@/lib/auth/actions'
import { AuthShell } from '@/components/AuthShell'
import { Logo, Tagline } from '@/components/Logo'

const estadoInicial: EstadoFormulario = {}

export default function PaginaRegisto() {
  const [estado, formAction, aPendente] = useActionState(registar, estadoInicial)

  return (
    <AuthShell>
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <Logo tamanho="sm" />
        <Tagline />
        <h1 className="mt-2 text-xl font-bold text-neutral-900">Criar conta</h1>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-neutral-700">
          Nome
          <input
            name="nome"
            required
            className="rounded border border-neutral-300 px-3 py-2 focus:border-ride-green focus:outline-none focus:ring-1 focus:ring-ride-green"
          />
        </label>

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
            minLength={8}
            className="rounded border border-neutral-300 px-3 py-2 focus:border-ride-green focus:outline-none focus:ring-1 focus:ring-ride-green"
          />
        </label>

        <fieldset className="flex flex-col gap-1 text-sm text-neutral-700">
          <legend className="mb-1 font-medium">Perfil</legend>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="tipo_perfil"
              value="independente"
              defaultChecked
              className="accent-ride-green"
            />
            Motard independente
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="tipo_perfil" value="socio" className="accent-ride-green" />
            Sócio de um clube
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="tipo_perfil"
              value="direccao_clube"
              className="accent-ride-green"
            />
            Direcção de clube
          </label>
        </fieldset>

        <p className="text-xs text-neutral-500">
          Depois de criares a conta, vais receber um e-mail de confirmação — só consegues entrar
          depois de confirmares. Se não aparecer na caixa de entrada, verifica a pasta de
          spam/lixo.
        </p>

        {estado.erro && <p className="text-sm text-ride-red">{estado.erro}</p>}
        {estado.mensagem && <p className="text-sm text-ride-green-dark">{estado.mensagem}</p>}

        <button
          type="submit"
          disabled={aPendente}
          className="rounded bg-ride-green px-3 py-2 font-medium text-white transition hover:bg-ride-green-dark disabled:opacity-50"
        >
          {aPendente ? 'A criar conta…' : 'Criar conta'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        Já tens conta?{' '}
        <Link href="/login" className="text-ride-green underline underline-offset-2">
          Entrar
        </Link>
      </p>
    </AuthShell>
  )
}
