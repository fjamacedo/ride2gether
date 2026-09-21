'use client'

import { useActionState, useTransition } from 'react'
import type { EstadoFormulario } from '@/lib/auth/actions'
import type { Mota } from '@/lib/types/database'

const estadoInicial: EstadoFormulario = {}

const classeInput =
  'rounded border border-neutral-300 px-3 py-2 focus:border-ride-green focus:outline-none focus:ring-1 focus:ring-ride-green'

export function GestaoMotas({
  motas,
  adicionar,
  remover,
}: {
  motas: Mota[]
  adicionar: (estado: EstadoFormulario, formData: FormData) => Promise<EstadoFormulario>
  remover: (motaId: string) => Promise<void>
}) {
  const [estado, formAction, aPendente] = useActionState(adicionar, estadoInicial)
  const [aRemover, iniciarRemocao] = useTransition()

  return (
    <div className="flex flex-col gap-4">
      {motas.length > 0 && (
        <ul className="flex flex-col gap-2">
          {motas.map((mota) => (
            <li
              key={mota.id}
              className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm"
            >
              <span className="text-neutral-800">
                {mota.marca}
                {mota.modelo ? ` ${mota.modelo}` : ''}
                {mota.ano ? ` (${mota.ano})` : ''}
                {mota.cilindrada_cc ? ` — ${mota.cilindrada_cc}cc` : ''}
              </span>
              <button
                disabled={aRemover}
                onClick={() => iniciarRemocao(() => remover(mota.id))}
                className="text-ride-red disabled:opacity-50"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}

      {motas.length < 2 ? (
        <form
          action={formAction}
          className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-3"
        >
          <p className="text-xs text-neutral-500">
            Podes registar até 2 motas ({motas.length}/2). Usadas para filtrar automaticamente os
            passeios com critérios de elegibilidade.
          </p>

          <div className="flex gap-3">
            <label className="flex flex-1 flex-col gap-1 text-sm text-neutral-700">
              Marca
              <input name="marca" required className={classeInput} />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-sm text-neutral-700">
              Modelo
              <input name="modelo" className={classeInput} />
            </label>
          </div>

          <div className="flex gap-3">
            <label className="flex flex-1 flex-col gap-1 text-sm text-neutral-700">
              Ano
              <input name="ano" type="number" min={1900} className={classeInput} />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-sm text-neutral-700">
              Cilindrada (cc)
              <input name="cilindrada_cc" type="number" min={0} className={classeInput} />
            </label>
          </div>

          {estado.erro && <p className="text-sm text-ride-red">{estado.erro}</p>}

          <button
            type="submit"
            disabled={aPendente}
            className="self-start rounded bg-ride-green px-3 py-2 text-sm font-medium text-white transition hover:bg-ride-green-dark disabled:opacity-50"
          >
            {aPendente ? 'A adicionar…' : 'Adicionar mota'}
          </button>
        </form>
      ) : (
        <p className="text-xs text-neutral-500">
          Já tens o máximo de 2 motas registadas. Remove uma para adicionar outra.
        </p>
      )}
    </div>
  )
}
