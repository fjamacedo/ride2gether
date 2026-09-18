'use client'

import { useState, useTransition } from 'react'
import { inscrever, cancelarInscricao } from '@/lib/data/passeios'

export function BotaoInscricao({
  passeioId,
  jaInscrito,
}: {
  passeioId: string
  jaInscrito: boolean
}) {
  const [aPendente, iniciarTransicao] = useTransition()
  const [erro, setErro] = useState<string | null>(null)

  if (jaInscrito) {
    return (
      <button
        disabled={aPendente}
        onClick={() =>
          iniciarTransicao(async () => {
            setErro(null)
            await cancelarInscricao(passeioId)
          })
        }
        className="rounded border px-4 py-2 text-sm disabled:opacity-50"
      >
        {aPendente ? 'A cancelar…' : 'Cancelar inscrição'}
      </button>
    )
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        disabled={aPendente}
        onClick={() =>
          iniciarTransicao(async () => {
            setErro(null)
            const resultado = await inscrever(passeioId)
            if (resultado?.erro) setErro(resultado.erro)
          })
        }
        className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {aPendente ? 'A inscrever…' : 'Inscrever-me'}
      </button>
      {erro && <p className="text-sm text-red-600">{erro}</p>}
    </div>
  )
}
