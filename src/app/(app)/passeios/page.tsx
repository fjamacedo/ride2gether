import Link from 'next/link'
import { listarPasseiosVisiveis } from '@/lib/data/passeios'

const rotulosAmbito: Record<string, string> = {
  privado: 'Privado (sócios)',
  distrital: 'Distrital',
  regional: 'Regional',
  nacional: 'Nacional',
  internacional: 'Internacional',
  publico: 'Público',
}

export default async function PaginaPasseios() {
  const passeios = await listarPasseiosVisiveis()

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-xl font-bold text-neutral-900">Passeios disponíveis</h1>

      {passeios.length === 0 && (
        <p className="text-neutral-500">Ainda não há passeios visíveis para ti.</p>
      )}

      <ul className="flex flex-col gap-3">
        {passeios.map((p) => (
          <li key={p.id}>
            <Link
              href={`/passeios/${p.id}`}
              className="block rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-sm transition hover:border-ride-green hover:shadow"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-900">{p.titulo}</span>
                <span className="rounded-full bg-ride-green/10 px-2 py-0.5 text-xs font-medium text-ride-green-dark">
                  {rotulosAmbito[p.ambito_visibilidade]}
                </span>
              </div>
              <div className="mt-1 text-sm text-neutral-600">
                {new Date(p.data).toLocaleString('pt-PT', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}{' '}
                — {p.local}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
