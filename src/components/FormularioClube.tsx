'use client'

import { useActionState } from 'react'
import type { EstadoFormulario } from '@/lib/auth/actions'

const estadoInicial: EstadoFormulario = {}

const classeInput =
  'rounded border border-neutral-300 px-3 py-2 focus:border-ride-green focus:outline-none focus:ring-1 focus:ring-ride-green'

export function FormularioClube({
  action,
}: {
  action: (estado: EstadoFormulario, formData: FormData) => Promise<EstadoFormulario>
}) {
  const [estado, formAction, aPendente] = useActionState(action, estadoInicial)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-neutral-700">
        Nome do clube
        <input name="nome" required className={classeInput} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-neutral-700">
        Localização
        <input name="localizacao" className={classeInput} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-neutral-700">
        NIF
        <input name="nif" required minLength={9} maxLength={9} className={classeInput} />
      </label>

      {estado.erro && <p className="text-sm text-ride-red">{estado.erro}</p>}

      <button
        type="submit"
        disabled={aPendente}
        className="self-start rounded bg-ride-green px-3 py-2 text-sm font-medium text-white transition hover:bg-ride-green-dark disabled:opacity-50"
      >
        {aPendente ? 'A registar…' : 'Registar clube'}
      </button>
    </form>
  )
}
