import { notFound, redirect } from 'next/navigation'
import { obterPasseio, editarPasseio, souOrganizadorDoPasseio } from '@/lib/data/passeios'
import { FormularioPasseio } from '@/components/FormularioPasseio'

export default async function PaginaEditarPasseio(props: PageProps<'/passeios/[id]/editar'>) {
  const { id } = await props.params
  const passeio = await obterPasseio(id)
  if (!passeio) notFound()

  const souOrganizador = await souOrganizadorDoPasseio(passeio)
  if (!souOrganizador) redirect(`/passeios/${id}`)

  const action = editarPasseio.bind(null, id)

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-xl font-bold text-neutral-900">Editar passeio</h1>
      <FormularioPasseio action={action} passeio={passeio} />
    </div>
  )
}
