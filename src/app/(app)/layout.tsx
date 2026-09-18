import Link from 'next/link'
import { obterUtilizadorAutenticado, obterMeuPerfil } from '@/lib/data/clube'
import { terminarSessao } from '@/lib/auth/actions'

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  const user = await obterUtilizadorAutenticado()
  const perfil = user ? await obterMeuPerfil() : null

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <Link href="/passeios" className="font-bold">
          Ride2gether
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {perfil?.tipo_perfil === 'direccao_clube' && (
            <Link href="/dashboard" className="underline">
              Gestão do clube
            </Link>
          )}
          <form action={terminarSessao}>
            <button type="submit" className="text-neutral-500">
              Sair
            </button>
          </form>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <nav className="sticky bottom-0 flex border-t bg-white">
        <Link href="/passeios" className="flex-1 py-3 text-center text-sm">
          Passeios
        </Link>
        <Link href="/passeios/novo" className="flex-1 py-3 text-center text-sm">
          Criar passeio
        </Link>
        <Link href="/perfil" className="flex-1 py-3 text-center text-sm">
          Perfil
        </Link>
      </nav>
    </div>
  )
}
