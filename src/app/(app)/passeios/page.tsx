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
      <h1 className="mb-4 text-xl font-bold">Passeios disponíveis</h1>

      {passeios.length === 0 && (
        <p className="text-neutral-500">Ainda não há passeios visíveis para ti.</p>
      )}

      <ul className="flex flex-col gap-3">
        {passeios.map((p) => (
          <li key={p.id}>
            <Link
              href={`/passeios/${p.id}`}
              className="block rounded border px-4 py-3 hover:bg-neutral-50"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{p.titulo}</span>
                <span className="text-xs text-neutral-500">
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
