import { redirect } from 'next/navigation'
import { obterClubeQueDirijo } from '@/lib/data/clube'
import { criarPasseio } from '@/lib/data/passeios'
import { FormularioPasseio } from '@/components/FormularioPasseio'

export default async function PaginaCriarPasseioClube() {
  const clube = await obterClubeQueDirijo()
  if (!clube) redirect('/dashboard')

  const action = criarPasseio.bind(null, {
    clubeId: clube.id,
    redirecionarPara: '/dashboard/passeios',
  })

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-xl font-bold text-neutral-900">Criar passeio do clube</h1>
      <FormularioPasseio action={action} />
    </div>
  )
}
