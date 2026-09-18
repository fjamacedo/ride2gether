import { notFound } from 'next/navigation'
import {
  obterPasseio,
  listarInscritos,
  obterMinhaInscricao,
  contarInscritos,
} from '@/lib/data/passeios'
import { BotaoInscricao } from '@/components/BotaoInscricao'

const rotulosAmbito: Record<string, string> = {
  privado: 'Privado (sócios)',
  distrital: 'Distrital',
  regional: 'Regional',
  nacional: 'Nacional',
  internacional: 'Internacional',
  publico: 'Público',
}

export default async function PaginaDetalhePasseio(props: PageProps<'/passeios/[id]'>) {
  const { id } = await props.params
  const passeio = await obterPasseio(id)
  if (!passeio) notFound()

  const [inscritos, minhaInscricao, totalInscritos] = await Promise.all([
    listarInscritos(id),
    obterMinhaInscricao(id),
    contarInscritos(id),
  ])

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <span className="text-xs text-neutral-500">{rotulosAmbito[passeio.ambito_visibilidade]}</span>
      <h1 className="text-2xl font-bold">{passeio.titulo}</h1>

      <dl className="mt-4 flex flex-col gap-1 text-sm text-neutral-700">
        <div>
          <dt className="inline font-medium">Data: </dt>
          <dd className="inline">
            {new Date(passeio.data).toLocaleString('pt-PT', {
              dateStyle: 'full',
              timeStyle: 'short',
            })}
          </dd>
        </div>
        <div>
          <dt className="inline font-medium">Ponto de encontro: </dt>
          <dd className="inline">{passeio.local}</dd>
        </div>
        {passeio.rota && (
          <div>
            <dt className="inline font-medium">Rota: </dt>
            <dd className="inline">{passeio.rota}</dd>
          </div>
        )}
        {passeio.max_participantes != null && (
          <div>
            <dt className="inline font-medium">Participantes: </dt>
            <dd className="inline">
              {totalInscritos} / {passeio.max_participantes}
            </dd>
          </div>
        )}
        {(passeio.cilindrada_min != null || passeio.cilindrada_max != null) && (
          <div>
            <dt className="inline font-medium">Cilindrada: </dt>
            <dd className="inline">
              {passeio.cilindrada_min ?? '—'} a {passeio.cilindrada_max ?? '—'} cc
            </dd>
          </div>
        )}
        {passeio.marca && (
          <div>
            <dt className="inline font-medium">Marca: </dt>
            <dd className="inline">{passeio.marca}</dd>
          </div>
        )}
      </dl>

      {passeio.descricao && <p className="mt-4 text-neutral-700">{passeio.descricao}</p>}

      <div className="mt-6">
        <BotaoInscricao passeioId={id} jaInscrito={!!minhaInscricao} />
      </div>

      <div className="mt-8">
        <h2 className="mb-2 font-medium">Inscritos ({inscritos.length})</h2>
        <ul className="flex flex-col gap-1 text-sm text-neutral-700">
          {inscritos.map((i) => (
            <li key={i.id}>{(i.perfis as { nome?: string } | null)?.nome ?? 'Utilizador'}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
