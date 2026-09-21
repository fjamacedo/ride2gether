import Link from 'next/link'

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-ride-black px-4 py-10">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-[2px]"
        style={{ backgroundImage: "url('/images/hero-motard.webp')" }}
      />
      <div className="absolute inset-0 bg-ride-black/70" />

      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl sm:p-8">
        {children}
      </div>

      <div className="relative z-10 mt-6 flex gap-4 text-xs text-neutral-400">
        <Link href="/termos" className="hover:text-white">
          Termos de Utilização
        </Link>
        <Link href="/privacidade" className="hover:text-white">
          Política de Privacidade
        </Link>
      </div>
    </main>
  )
}
