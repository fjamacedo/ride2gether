import { redirect } from 'next/navigation'
import Link from 'next/link'
import { obterClubeQueDirijo } from '@/lib/data/clube'
import { listarPasseiosDoClube } from '@/lib/data/passeios'

export default async function PaginaPasseiosClube() {
  const clube = await obterClubeQueDirijo()
  if (!clube) redirect('/dashboard')

  const passeios = await listarPasseiosDoClube(clube.id)

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Passeios do clube</h1>
        <Link href="/dashboard/passeios/novo" className="rounded bg-black px-3 py-2 text-sm text-white">
          Novo passeio
        </Link>
      </div>

      <ul className="flex flex-col gap-2">
        {passeios.map((p) => (
          <li key={p.id}>
            <Link href={`/passeios/${p.id}`} className="block rounded border px-3 py-2 hover:bg-neutral-50">
              <p className="font-medium">{p.titulo}</p>
              <p className="text-sm text-neutral-600">
                {new Date(p.data).toLocaleString('pt-PT', { dateStyle: 'medium', timeStyle: 'short' })} —{' '}
                {p.local}
              </p>
            </Link>
          </li>
        ))}
        {passeios.length === 0 && (
          <p className="text-sm text-neutral-500">O clube ainda não organizou passeios.</p>
        )}
      </ul>
    </div>
  )
}
