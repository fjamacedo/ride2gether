import { redirect } from 'next/navigation'
import {
  obterClubeQueDirijo,
  listarSocios,
  adicionarSocioPorEmail,
  actualizarEstadoSocio,
  removerSocio,
} from '@/lib/data/clube'
import { FormularioAdicionarSocio } from '@/components/FormularioAdicionarSocio'
import { AccoesSocio } from '@/components/AccoesSocio'

export default async function PaginaSocios() {
  const clube = await obterClubeQueDirijo()
  if (!clube) redirect('/dashboard')

  const socios = await listarSocios(clube.id)
  const acaoAdicionar = adicionarSocioPorEmail.bind(null, clube.id)

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-xl font-bold">Sócios</h1>

      <div className="mb-6">
        <FormularioAdicionarSocio action={acaoAdicionar} />
      </div>

      <ul className="flex flex-col gap-2">
        {socios.map((s) => (
          <li
            key={s.utilizador_id}
            className="flex items-center justify-between rounded border px-3 py-2"
          >
            <div>
              <p className="font-medium">
                {(s.perfis as { nome?: string } | null)?.nome ?? 'Utilizador'}
              </p>
              <p className="text-xs text-neutral-500">{s.estado}</p>
            </div>
            <AccoesSocio
              clubeId={clube.id}
              utilizadorId={s.utilizador_id}
              estado={s.estado}
              actualizarEstado={actualizarEstadoSocio}
              remover={removerSocio}
            />
          </li>
        ))}
        {socios.length === 0 && (
          <p className="text-sm text-neutral-500">Ainda não há sócios registados.</p>
        )}
      </ul>
    </div>
  )
}
