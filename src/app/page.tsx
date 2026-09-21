import Link from "next/link";
import { redirect } from "next/navigation";
import { obterUtilizadorAutenticado } from "@/lib/data/clube";
import { Logo, Tagline } from "@/components/Logo";

export default async function PaginaInicial() {
  const user = await obterUtilizadorAutenticado();
  if (user) redirect("/passeios");

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-ride-black px-6 text-center">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/images/hero-motard.webp')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ride-black via-ride-black/70 to-ride-black/40" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <Logo tamanho="lg" claro />
          <Tagline claro />
        </div>

        <div className="flex w-full flex-col gap-3">
          <Link
            href="/registo"
            className="rounded bg-ride-green px-4 py-3 text-center font-medium text-white transition hover:bg-ride-green-dark"
          >
            Criar conta
          </Link>
          <Link
            href="/login"
            className="rounded border border-white/30 px-4 py-3 text-center font-medium text-white transition hover:bg-white/10"
          >
            Entrar
          </Link>
        </div>
      </div>
    </main>
  );
}
