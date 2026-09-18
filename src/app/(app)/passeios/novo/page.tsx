import { criarPasseio } from '@/lib/data/passeios'
import { FormularioPasseio } from '@/components/FormularioPasseio'

export default function PaginaCriarPasseio() {
  const action = criarPasseio.bind(null, { redirecionarPara: '/passeios' })

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-xl font-bold">Criar passeio</h1>
      <FormularioPasseio action={action} />
    </div>
  )
}
