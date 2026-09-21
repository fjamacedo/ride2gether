'use client'

import { useActionState } from 'react'
import type { EstadoFormulario } from '@/lib/auth/actions'
import type { Perfil } from '@/lib/types/database'

const estadoInicial: EstadoFormulario = {}

export function FormularioPerfil({
  action,
  perfil,
}: {
  action: (estado: EstadoFormulario, formData: FormData) => Promise<EstadoFormulario>
  perfil: Perfil | null
}) {
  const [estado, formAction, aPendente] = useActionState(action, estadoInicial)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-neutral-700">
        Nome
        <input
          name="nome"
          required
          defaultValue={perfil?.nome ?? ''}
          className="rounded border border-neutral-300 px-3 py-2 focus:border-ride-green focus:outline-none focus:ring-1 focus:ring-ride-green"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-neutral-700">
        Contacto
        <input
          name="contacto"
          defaultValue={perfil?.contacto ?? ''}
          className="rounded border border-neutral-300 px-3 py-2 focus:border-ride-green focus:outline-none focus:ring-1 focus:ring-ride-green"
        />
      </label>

      {estado.erro && <p className="text-sm text-ride-red">{estado.erro}</p>}

      <button
        type="submit"
        disabled={aPendente}
        className="self-start rounded bg-ride-green px-3 py-2 text-sm font-medium text-white transition hover:bg-ride-green-dark disabled:opacity-50"
      >
        {aPendente ? 'A guardar…' : 'Guardar'}
      </button>
    </form>
  )
}
