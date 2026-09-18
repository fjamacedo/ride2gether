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
      <label className="flex flex-col gap-1 text-sm">
        Nome
        <input
          name="nome"
          required
          defaultValue={perfil?.nome ?? ''}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Contacto
        <input
          name="contacto"
          defaultValue={perfil?.contacto ?? ''}
          className="rounded border px-3 py-2"
        />
      </label>

      {estado.erro && <p className="text-sm text-red-600">{estado.erro}</p>}

      <button
        type="submit"
        disabled={aPendente}
        className="self-start rounded bg-black px-3 py-2 text-sm text-white disabled:opacity-50"
      >
        {aPendente ? 'A guardar…' : 'Guardar'}
      </button>
    </form>
  )
}
