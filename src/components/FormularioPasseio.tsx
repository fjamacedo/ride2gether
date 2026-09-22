'use client'

import { useActionState } from 'react'
import type { EstadoFormulario } from '@/lib/auth/actions'
import type { Passeio } from '@/lib/types/database'

const estadoInicial: EstadoFormulario = {}

const classeInput =
  'rounded border border-neutral-300 px-3 py-2 focus:border-ride-green focus:outline-none focus:ring-1 focus:ring-ride-green'

function paraDatetimeLocal(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function FormularioPasseio({
  action,
  passeio,
}: {
  action: (estado: EstadoFormulario, formData: FormData) => Promise<EstadoFormulario>
  passeio?: Passeio
}) {
  const [estado, formAction, aPendente] = useActionState(action, estadoInicial)
  const aEditar = !!passeio

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-neutral-700">
        Título
        <input name="titulo" required defaultValue={passeio?.titulo} className={classeInput} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-neutral-700">
        Data e hora
        <input
          name="data"
          type="datetime-local"
          required
          defaultValue={passeio ? paraDatetimeLocal(passeio.data) : undefined}
          className={classeInput}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-neutral-700">
        Ponto de encontro
        <input name="local" required defaultValue={passeio?.local} className={classeInput} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-neutral-700">
        Descrição
        <textarea
          name="descricao"
          rows={3}
          defaultValue={passeio?.descricao ?? undefined}
          className={classeInput}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-neutral-700">
        Rota (texto ou link para mapa externo)
        <input name="rota" defaultValue={passeio?.rota ?? undefined} className={classeInput} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-neutral-700">
        Âmbito de visibilidade
        <select
          name="ambito_visibilidade"
          required
          defaultValue={passeio?.ambito_visibilidade ?? 'publico'}
          className={classeInput}
        >
          <option value="publico">Público</option>
          <option value="nacional">Nacional</option>
          <option value="internacional">Internacional</option>
          <option value="regional">Regional</option>
          <option value="distrital">Distrital</option>
          <option value="privado">Privado (só sócios)</option>
        </select>
      </label>

      <fieldset className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-3">
        <legend className="px-1 text-xs font-medium text-neutral-500">
          Critérios de selecção (opcionais)
        </legend>

        <label className="flex flex-col gap-1 text-sm text-neutral-700">
          Número máximo de participantes
          <input
            name="max_participantes"
            type="number"
            min={1}
            defaultValue={passeio?.max_participantes ?? undefined}
            className={classeInput}
          />
        </label>

        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1 text-sm text-neutral-700">
            Cilindrada mín. (cc)
            <input
              name="cilindrada_min"
              type="number"
              min={0}
              defaultValue={passeio?.cilindrada_min ?? undefined}
              className={classeInput}
            />
          </label>
          <label className="flex flex-1 flex-col gap-1 text-sm text-neutral-700">
            Cilindrada máx. (cc)
            <input
              name="cilindrada_max"
              type="number"
              min={0}
              defaultValue={passeio?.cilindrada_max ?? undefined}
              className={classeInput}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm text-neutral-700">
          Marca
          <input name="marca" defaultValue={passeio?.marca ?? undefined} className={classeInput} />
        </label>
      </fieldset>

      {estado.erro && <p className="text-sm text-ride-red">{estado.erro}</p>}

      <button
        type="submit"
        disabled={aPendente}
        className="rounded bg-ride-green px-3 py-2 font-medium text-white transition hover:bg-ride-green-dark disabled:opacity-50"
      >
        {aPendente ? (aEditar ? 'A guardar…' : 'A criar…') : aEditar ? 'Guardar alterações' : 'Criar passeio'}
      </button>
    </form>
  )
}
