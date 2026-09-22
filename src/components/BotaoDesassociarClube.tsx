'use client'

import { useState, useTransition } from 'react'
import type { EstadoFormulario } from '@/lib/auth/actions'

export function BotaoDesassociarClube({
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
        onClick={() => {
          if (!window.confirm('Sair deste clube?')) return
          iniciarTransicao(async () => {
            setErro(null)
            const resultado = await action(clubeId)
            if (resultado?.erro) setErro(resultado.erro)
          })
        }}
        className="text-sm text-neutral-500 underline hover:text-ride-red disabled:opacity-50"
      >
        {aPendente ? 'A sair…' : 'Sair'}
      </button>
      {erro && <p className="text-xs text-ride-red">{erro}</p>}
    </div>
  )
}
