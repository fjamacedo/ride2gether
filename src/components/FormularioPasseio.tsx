'use client'

import { useActionState } from 'react'
import type { EstadoFormulario } from '@/lib/auth/actions'

const estadoInicial: EstadoFormulario = {}

export function FormularioPasseio({
  action,
}: {
  action: (estado: EstadoFormulario, formData: FormData) => Promise<EstadoFormulario>
}) {
  const [estado, formAction, aPendente] = useActionState(action, estadoInicial)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Título
        <input name="titulo" required className="rounded border px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Data e hora
        <input name="data" type="datetime-local" required className="rounded border px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Ponto de encontro
        <input name="local" required className="rounded border px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Descrição
        <textarea name="descricao" rows={3} className="rounded border px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Rota (texto ou link para mapa externo)
        <input name="rota" className="rounded border px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Âmbito de visibilidade
        <select name="ambito_visibilidade" required className="rounded border px-3 py-2">
          <option value="publico">Público</option>
          <option value="nacional">Nacional</option>
          <option value="internacional">Internacional</option>
          <option value="regional">Regional</option>
          <option value="distrital">Distrital</option>
          <option value="privado">Privado (só sócios)</option>
        </select>
      </label>

      <fieldset className="flex flex-col gap-3 rounded border p-3">
        <legend className="px-1 text-xs text-neutral-500">
          Critérios de selecção (opcionais)
        </legend>

        <label className="flex flex-col gap-1 text-sm">
          Número máximo de participantes
          <input
            name="max_participantes"
            type="number"
            min={1}
            className="rounded border px-3 py-2"
          />
        </label>

        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1 text-sm">
            Cilindrada mín. (cc)
            <input
              name="cilindrada_min"
              type="number"
              min={0}
              className="rounded border px-3 py-2"
            />
          </label>
          <label className="flex flex-1 flex-col gap-1 text-sm">
            Cilindrada máx. (cc)
            <input
              name="cilindrada_max"
              type="number"
              min={0}
              className="rounded border px-3 py-2"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          Marca
          <input name="marca" className="rounded border px-3 py-2" />
        </label>
      </fieldset>

      {estado.erro && <p className="text-sm text-red-600">{estado.erro}</p>}

      <button
        type="submit"
        disabled={aPendente}
        className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
      >
        {aPendente ? 'A criar…' : 'Criar passeio'}
      </button>
    </form>
  )
}
