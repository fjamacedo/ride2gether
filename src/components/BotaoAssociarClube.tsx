'use client'

import { useState, useTransition } from 'react'
import type { EstadoFormulario } from '@/lib/auth/actions'

export function BotaoAssociarClube({
  clubeId,
  action,
}: {
  clubeId: string
  action: (clubeId: string) => Promise<EstadoFormulario>
}) {
  const [aPendente, iniciarTransicao] = useTransition()
  const [erro, setErro] = useState<string | null>(null)

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        disabled={aPendente}
        onClick={() =>
          iniciarTransicao(async () => {
            setErro(null)
            const resultado = await action(clubeId)
            if (resultado?.erro) setErro(resultado.erro)
          })
        }
        className="rounded border border-ride-green px-3 py-1 text-sm text-ride-green transition hover:bg-ride-green hover:text-white disabled:opacity-50"
      >
        {aPendente ? 'A associar…' : 'Associar-me'}
      </button>
      {erro && <p className="text-xs text-ride-red">{erro}</p>}
    </div>
  )
}
