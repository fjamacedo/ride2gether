import Link from 'next/link'
import { redirect } from 'next/navigation'
import { obterUtilizadorAutenticado, obterClubeQueDirijo, obterMeuPerfil } from '@/lib/data/clube'
import { terminarSessao } from '@/lib/auth/actions'

export default async function LayoutDashboard({ children }: { children: React.ReactNode }) {
  const user = await obterUtilizadorAutenticado()
  if (!user) redirect('/login')

  const [clube, perfil] = await Promise.all([obterClubeQueDirijo(), obterMeuPerfil()])

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <Link href="/dashboard" className="font-bold">
          {clube?.nome ?? 'Gestão do clube'}
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/passeios" className="underline">
            Ver como motard
          </Link>
          {perfil?.nome && <span className="text-neutral-600">{perfil.nome}</span>}
          <form action={terminarSessao}>
            <button type="submit" className="text-neutral-500">
              Sair
            </button>
          </form>
        </nav>
      </header>

      {clube && (
        <nav className="flex gap-4 border-b px-4 py-2 text-sm">
          <Link href="/dashboard/socios">Sócios</Link>
          <Link href="/dashboard/passeios">Passeios</Link>
        </nav>
      )}

      <main className="flex-1">{children}</main>
    </div>
  )
}
