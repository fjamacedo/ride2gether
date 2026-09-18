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
        className="rounded border px-2 py-1 disabled:opacity-50"
      >
        Marcar {novoEstado}
      </button>
      <button
        disabled={aPendente}
        onClick={() => iniciarTransicao(() => remover(clubeId, utilizadorId))}
        className="rounded border border-red-300 px-2 py-1 text-red-600 disabled:opacity-50"
      >
        Remover
      </button>
    </div>
  )
}
