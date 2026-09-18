import { obterClubeQueDirijo, registarClube } from '@/lib/data/clube'
import { FormularioClube } from '@/components/FormularioClube'

export default async function PaginaDashboard() {
  const clube = await obterClubeQueDirijo()

  if (!clube) {
    return (
      <div className="mx-auto max-w-lg px-4 py-6">
        <h1 className="mb-2 text-xl font-bold">Registar o meu clube</h1>
        <p className="mb-4 text-sm text-neutral-600">
          Ainda não dirige nenhum clube na plataforma. Preencha os dados abaixo para o criar.
        </p>
        <FormularioClube action={registarClube} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="mb-4 text-xl font-bold">{clube.nome}</h1>
      <dl className="flex flex-col gap-1 text-sm text-neutral-700">
        <div>
          <dt className="inline font-medium">Localização: </dt>
          <dd className="inline">{clube.localizacao ?? '—'}</dd>
        </div>
        <div>
          <dt className="inline font-medium">NIF: </dt>
          <dd className="inline">{clube.nif}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Registado em: </dt>
          <dd className="inline">
            {new Date(clube.data_registo).toLocaleDateString('pt-PT')}
          </dd>
        </div>
      </dl>
    </div>
  )
}
