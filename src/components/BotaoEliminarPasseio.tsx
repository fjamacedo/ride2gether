'use client'

import { useState, useTransition } from 'react'
import type { EstadoFormulario } from '@/lib/auth/actions'

export function BotaoEliminarPasseio({
  passeioId,
  redirecionarPara,
  action,
}: {
  passeioId: string
  redirecionarPara: string
  action: (passeioId: string, redirecionarPara: string) => Promise<EstadoFormulario>
}) {
  const [aPendente, iniciarTransicao] = useTransition()
  const [erro, setErro] = useState<string | null>(null)

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        disabled={aPendente}
        onClick={() => {
          if (!window.confirm('Eliminar este passeio? Esta acção não pode ser desfeita.')) return
          iniciarTransicao(async () => {
            setErro(null)
            const resultado = await action(passeioId, redirecionarPara)
            if (resultado?.erro) setErro(resultado.erro)
          })
        }}
        className="rounded border border-ride-red px-3 py-2 text-sm text-ride-red transition hover:bg-ride-red hover:text-white disabled:opacity-50"
      >
        {aPendente ? 'A eliminar…' : 'Eliminar passeio'}
      </button>
      {erro && <p className="text-xs text-ride-red">{erro}</p>}
    </div>
  )
}
