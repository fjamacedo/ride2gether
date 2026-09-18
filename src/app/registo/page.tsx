'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { registar, type EstadoFormulario } from '@/lib/auth/actions'

const estadoInicial: EstadoFormulario = {}

export default function PaginaRegisto() {
  const [estado, formAction, aPendente] = useActionState(registar, estadoInicial)

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <p className="text-sm text-neutral-600">
          Ride2gether — Passeios • Amigos • Estradas • Memórias
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Nome
          <input name="nome" required className="rounded border px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          E-mail
          <input name="email" type="email" required className="rounded border px-3 py-2" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="rounded border px-3 py-2"
          />
        </label>

        <fieldset className="flex flex-col gap-1 text-sm">
          <legend className="mb-1">Perfil</legend>
          <label className="flex items-center gap-2">
            <input type="radio" name="tipo_perfil" value="independente" defaultChecked />
            Motard independente
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="tipo_perfil" value="socio" />
            Sócio de um clube
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="tipo_perfil" value="direccao_clube" />
            Direcção de clube
          </label>
        </fieldset>

        {estado.erro && <p className="text-sm text-red-600">{estado.erro}</p>}

        <button
          type="submit"
          disabled={aPendente}
          className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
        >
          {aPendente ? 'A criar conta…' : 'Criar conta'}
        </button>
      </form>

      <p className="text-sm">
        Já tens conta?{' '}
        <Link href="/login" className="underline">
          Entrar
        </Link>
      </p>
    </main>
  )
}
