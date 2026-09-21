'use client'

import { useTransition } from 'react'
import type { EstadoMembro } from '@/lib/types/database'

export function AccoesSocio({
  clubeId,
  utilizadorId,
  estado,
  actualizarEstado,
  remover,
}: {
  clubeId: string
  utilizadorId: string
  estado: EstadoMembro
  actualizarEstado: (clubeId: string, utilizadorId: string, estado: EstadoMembro) => Promise<void>
  remover: (clubeId: string, utilizadorId: string) => Promise<void>
}) {
  const [aPendente, iniciarTransicao] = useTransition()
  const novoEstado: EstadoMembro = estado === 'activo' ? 'inactivo' : 'activo'

  return (
    <div className="flex gap-2 text-sm">
      <button
        disabled={aPendente}
        onClick={() => iniciarTransicao(() => actualizarEstado(clubeId, utilizadorId, novoEstado))}
        className="rounded border border-neutral-300 px-2 py-1 text-neutral-700 transition hover:border-ride-green hover:text-ride-green disabled:opacity-50"
      >
        Marcar {novoEstado}
      </button>
      <button
        disabled={aPendente}
        onClick={() => iniciarTransicao(() => remover(clubeId, utilizadorId))}
        className="rounded border border-ride-red/40 px-2 py-1 text-ride-red transition hover:bg-ride-red hover:text-white disabled:opacity-50"
      >
        Remover
      </button>
    </div>
  )
}
