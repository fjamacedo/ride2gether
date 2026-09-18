import Link from "next/link";
import { redirect } from "next/navigation";
import { obterUtilizadorAutenticado } from "@/lib/data/clube";

export default async function PaginaInicial() {
  const user = await obterUtilizadorAutenticado();
  if (user) redirect("/passeios");

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-8 px-6 text-center">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Ride2gether</h1>
        <p className="mt-2 text-neutral-600">Passeios • Amigos • Estradas • Memórias</p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <Link
          href="/registo"
          className="rounded bg-black px-4 py-3 text-center font-medium text-white"
        >
          Criar conta
        </Link>
        <Link
          href="/login"
          className="rounded border px-4 py-3 text-center font-medium"
        >
          Entrar
        </Link>
      </div>
    </main>
  );
}
