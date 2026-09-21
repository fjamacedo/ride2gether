import Link from 'next/link'
import { redirect } from 'next/navigation'
import { obterUtilizadorAutenticado, obterClubeQueDirijo, obterMeuPerfil } from '@/lib/data/clube'
import { terminarSessao } from '@/lib/auth/actions'

export default async function LayoutDashboard({ children }: { children: React.ReactNode }) {
  const user = await obterUtilizadorAutenticado()
  if (!user) redirect('/login')

  const [clube, perfil] = await Promise.all([obterClubeQueDirijo(), obterMeuPerfil()])

  return (
    <div className="flex min-h-dvh flex-col bg-neutral-50">
      <header className="flex items-center justify-between bg-ride-black px-4 py-3">
        <Link href="/dashboard" className="font-bold text-white">
          {clube?.nome ?? 'Gestão do clube'}
        </Link>
        <nav className="flex items-center gap-3 text-sm text-neutral-300">
          <Link href="/passeios" className="text-ride-gold underline underline-offset-2">
            Ver como motard
          </Link>
          {perfil?.nome && <span>{perfil.nome}</span>}
          <form action={terminarSessao}>
            <button type="submit" className="text-neutral-400 hover:text-white">
              Sair
            </button>
          </form>
        </nav>
      </header>

      {clube && (
        <nav className="flex gap-4 border-b bg-white px-4 py-2 text-sm font-medium text-neutral-700">
          <Link href="/dashboard/socios" className="hover:text-ride-green">
            Sócios
          </Link>
          <Link href="/dashboard/passeios" className="hover:text-ride-green">
            Passeios
          </Link>
        </nav>
      )}

      <main className="flex-1">{children}</main>
    </div>
  )
}
