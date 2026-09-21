import Link from 'next/link'
import { Logo } from '@/components/Logo'

export const metadata = { title: 'Termos de Utilização — Ride2gether' }

export default function PaginaTermos() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-neutral-800">
      <Link href="/">
        <Logo tamanho="sm" />
      </Link>

      <h1 className="mt-6 mb-2 text-2xl font-bold text-neutral-900">Termos de Utilização</h1>
      <p className="mb-8 text-sm text-neutral-500">Última actualização: Setembro de 2026</p>

      <div className="flex flex-col gap-6 text-sm leading-relaxed">
        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">1. O que é o Ride2gether</h2>
          <p>
            O Ride2gether é uma plataforma para gestão associativa de motoclubes e organização de
            passeios de mota. Nesta Fase 1, o serviço é gratuito e não inclui pagamentos,
            marketplace nem rede de parceiros comerciais.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">2. Criação de conta</h2>
          <p>
            Para usares o Ride2gether, precisas de criar uma conta com dados verdadeiros e
            actualizados. És responsável por manter a confidencialidade da tua password e por
            toda a actividade realizada através da tua conta.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">3. Regras de utilização</h2>
          <p>Ao usares o Ride2gether, comprometes-te a:</p>
          <ul className="mt-2 list-disc pl-5">
            <li>Fornecer informação verdadeira sobre ti, o teu clube e os passeios que crias</li>
            <li>Não usar a plataforma para fins ilegais ou fraudulentos</li>
            <li>Respeitar os outros utilizadores</li>
            <li>Não tentar aceder a contas ou dados que não sejam teus</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">
            4. Passeios — aviso importante sobre segurança
          </h2>
          <p>
            O Ride2gether é apenas uma ferramenta de coordenação e divulgação de passeios de
            mota. <strong>Não organizamos, supervisionamos nem somos responsáveis</strong> pela
            condução, segurança rodoviária, seguros ou qualquer incidente ocorrido durante um
            passeio criado ou divulgado através da plataforma. A participação em passeios é
            sempre por conta e risco de cada participante, que deve cumprir o código da estrada e
            usar equipamento de protecção adequado.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">5. Conteúdo que publicas</h2>
          <p>
            Manténs os direitos sobre a informação que publicas (descrições de passeios, dados do
            clube, etc.), mas autorizas o Ride2gether a mostrá-la a outros utilizadores conforme
            necessário para o funcionamento do serviço (ex.: âmbito de visibilidade que
            escolheres).
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">6. Disponibilidade do serviço</h2>
          <p>
            Esta é uma fase de validação (MVP). O serviço é fornecido &ldquo;tal como
            está&rdquo;, sem
            garantias de disponibilidade contínua ou ausência de erros. Podemos alterar,
            suspender ou descontinuar funcionalidades a qualquer momento, procurando sempre
            avisar com a maior antecedência possível.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">7. Suspensão ou eliminação de conta</h2>
          <p>
            Podemos suspender ou eliminar contas que violem estes termos, nomeadamente por
            informação falsa, comportamento abusivo ou utilização ilegal da plataforma.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">8. Alterações a estes termos</h2>
          <p>
            Podemos actualizar estes termos à medida que o serviço evolui (nomeadamente nas fases
            seguintes de pagamentos e marketplace). Alterações relevantes serão comunicadas
            através da plataforma.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">9. Lei aplicável</h2>
          <p>
            Estes termos regem-se pela lei portuguesa. Para qualquer litígio, é competente o foro
            português legalmente aplicável.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">10. Contacto</h2>
          <p>
            Para qualquer questão sobre estes termos:{' '}
            <a href="mailto:geral@ride2gether.pt" className="text-ride-green underline">
              geral@ride2gether.pt
            </a>
          </p>
        </section>

        <p className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-500">
          Este documento foi redigido de boa-fé, mas não substitui aconselhamento jurídico
          profissional. Recomenda-se revisão por um advogado antes de uma utilização com um
          volume relevante de utilizadores reais.
        </p>
      </div>
    </main>
  )
}
