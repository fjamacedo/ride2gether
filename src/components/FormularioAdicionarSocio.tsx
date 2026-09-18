'use client'

import { useRef, useState, useTransition } from 'react'
import type { EstadoFormulario } from '@/lib/auth/actions'

export function FormularioAdicionarSocio({
  action,
}: {
  action: (formData: FormData) => Promise<EstadoFormulario>
}) {
  const [aPendente, iniciarTransicao] = useTransition()
  const [erro, setErro] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        iniciarTransicao(async () => {
          setErro(null)
          const resultado = await action(formData)
          if (resultado?.erro) {
            setErro(resultado.erro)
          } else {
            formRef.current?.reset()
          }
        })
      }}
      className="flex items-end gap-2"
    >
      <label className="flex flex-1 flex-col gap-1 text-sm">
        Adicionar sócio pelo e-mail
        <input
          name="email"
          type="email"
          required
          placeholder="socio@exemplo.pt"
          className="rounded border px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={aPendente}
        className="rounded bg-black px-3 py-2 text-sm text-white disabled:opacity-50"
      >
        {aPendente ? 'A adicionar…' : 'Adicionar'}
      </button>
      {erro && <p className="text-sm text-red-600">{erro}</p>}
    </form>
  )
}
