import {
  obterMeuPerfil,
  listarClubes,
  obterMinhasAdesoes,
  actualizarPerfil,
  associarAClube,
} from '@/lib/data/clube'
import { listarMinhasMotas, adicionarMota, removerMota } from '@/lib/data/motas'
import Link from 'next/link'
import { ActivarNotificacoes } from '@/components/ActivarNotificacoes'
import { FormularioPerfil } from '@/components/FormularioPerfil'
import { BotaoAssociarClube } from '@/components/BotaoAssociarClube'
import { GestaoMotas } from '@/components/GestaoMotas'

export default async function PaginaPerfil() {
  const [perfil, clubes, adesoes, motas] = await Promise.all([
    obterMeuPerfil(),
    listarClubes(),
    obterMinhasAdesoes(),
    listarMinhasMotas(),
  ])

  const idsClubesAssociados = new Set(adesoes.map((a) => a.clube_id))

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-6">
      <section>
        <h1 className="mb-4 text-xl font-bold text-neutral-900">O meu perfil</h1>
        <FormularioPerfil action={actualizarPerfil} perfil={perfil} />
      </section>

      <section>
        <h2 className="mb-2 font-medium text-neutral-900">As minhas motas</h2>
        <GestaoMotas motas={motas} adicionar={adicionarMota} remover={removerMota} />
      </section>

      <section>
        <h2 className="mb-2 font-medium text-neutral-900">Notificações</h2>
        <ActivarNotificacoes />
      </section>

      <section>
        <h2 className="mb-2 font-medium text-neutral-900">Clubes</h2>
        {adesoes.length > 0 && (
          <ul className="mb-3 flex flex-col gap-1 text-sm text-neutral-700">
            {adesoes.map((a) => (
              <li key={a.clube_id}>
                {(a.clubes as { nome?: string } | null)?.nome} — {a.estado}
              </li>
            ))}
          </ul>
        )}

        <p className="mb-2 text-sm text-neutral-500">Associar-me a um clube:</p>
        <ul className="flex flex-col gap-2">
          {clubes
            .filter((c) => !idsClubesAssociados.has(c.id))
            .map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-sm"
              >
                <span className="text-neutral-800">
                  {c.nome}
                  {c.localizacao && (
                    <span className="text-neutral-500"> — {c.localizacao}</span>
                  )}
                </span>
                <BotaoAssociarClube clubeId={c.id} action={associarAClube} />
              </li>
            ))}
        </ul>
      </section>

      <section className="flex gap-4 border-t pt-4 text-sm text-neutral-500">
        <Link href="/termos" className="underline hover:text-ride-green">
          Termos de Utilização
        </Link>
        <Link href="/privacidade" className="underline hover:text-ride-green">
          Política de Privacidade
        </Link>
      </section>
    </div>
  )
}
