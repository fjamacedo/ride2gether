import Link from 'next/link'
import { obterUtilizadorAutenticado, obterMeuPerfil } from '@/lib/data/clube'
import { terminarSessao } from '@/lib/auth/actions'
import { Logo } from '@/components/Logo'

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  const user = await obterUtilizadorAutenticado()
  const perfil = user ? await obterMeuPerfil() : null

  return (
    <div className="flex min-h-dvh flex-col bg-neutral-50">
      <header className="flex items-center justify-between bg-ride-black px-4 py-3">
        <Link href="/passeios">
          <Logo tamanho="sm" claro />
        </Link>
        <nav className="flex items-center gap-3 text-sm text-neutral-300">
          {perfil?.tipo_perfil === 'direccao_clube' && (
            <Link href="/dashboard" className="text-ride-gold underline underline-offset-2">
              Gestão do clube
            </Link>
          )}
          {perfil?.nome && <span>{perfil.nome}</span>}
          <form action={terminarSessao}>
            <button type="submit" className="text-neutral-400 hover:text-white">
              Sair
            </button>
          </form>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <nav className="sticky bottom-0 flex border-t bg-white">
        <Link
          href="/passeios"
          className="flex-1 py-3 text-center text-sm font-medium text-neutral-700 hover:text-ride-green"
        >
          Passeios
        </Link>
        <Link
          href="/passeios/novo"
          className="flex-1 border-x py-3 text-center text-sm font-medium text-neutral-700 hover:text-ride-green"
        >
          Criar passeio
        </Link>
        <Link
          href="/perfil"
          className="flex-1 py-3 text-center text-sm font-medium text-neutral-700 hover:text-ride-green"
        >
          Perfil
        </Link>
      </nav>
    </div>
  )
}
