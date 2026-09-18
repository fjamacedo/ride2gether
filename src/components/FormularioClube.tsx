'use client'

import { useActionState } from 'react'
import type { EstadoFormulario } from '@/lib/auth/actions'

const estadoInicial: EstadoFormulario = {}

export function FormularioClube({
  action,
}: {
  action: (estado: EstadoFormulario, formData: FormData) => Promise<EstadoFormulario>
}) {
  const [estado, formAction, aPendente] = useActionState(action, estadoInicial)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Nome do clube
        <input name="nome" required className="rounded border px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Localização
        <input name="localizacao" className="rounded border px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        NIF
        <input name="nif" required minLength={9} maxLength={9} className="rounded border px-3 py-2" />
      </label>

      {estado.erro && <p className="text-sm text-red-600">{estado.erro}</p>}

      <button
        type="submit"
        disabled={aPendente}
        className="self-start rounded bg-black px-3 py-2 text-sm text-white disabled:opacity-50"
      >
        {aPendente ? 'A registar…' : 'Registar clube'}
      </button>
    </form>
  )
}
