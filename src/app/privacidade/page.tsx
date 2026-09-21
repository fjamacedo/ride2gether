import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { BotaoVoltar } from '@/components/BotaoVoltar'

export const metadata = { title: 'Política de Privacidade — Ride2gether' }

export default function PaginaPrivacidade() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-neutral-800">
      <BotaoVoltar />
      <Link href="/">
        <Logo tamanho="sm" />
      </Link>

      <h1 className="mt-6 mb-2 text-2xl font-bold text-neutral-900">Política de Privacidade</h1>
      <p className="mb-8 text-sm text-neutral-500">Última actualização: Setembro de 2026</p>

      <div className="flex flex-col gap-6 text-sm leading-relaxed">
        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">1. Quem somos</h2>
          <p>
            O Ride2gether é operado por Fernando José Amaral de Macedo, em nome pessoal, na
            presente fase de validação do serviço (Fase 1 — sem constituição de sociedade). É o
            responsável pelo tratamento dos dados pessoais recolhidos através da plataforma.
          </p>
          <p className="mt-2">
            Contacto para questões de privacidade:{' '}
            <a href="mailto:fjamacedo@gmail.com" className="text-ride-green underline">
              fjamacedo@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">2. Que dados recolhemos</h2>
          <ul className="list-disc pl-5">
            <li>
              <strong>Conta e perfil</strong>: nome, e-mail, contacto (opcional), NIF (opcional),
              tipo de perfil (motard independente, sócio ou direcção de clube).
            </li>
            <li>
              <strong>Motas</strong>: marca, modelo, ano e cilindrada (até 2 por utilizador,
              opcional), para filtragem de elegibilidade em passeios.
            </li>
            <li>
              <strong>Clube</strong> (se registares um): nome, localização e NIF (obrigatório
              para clubes).
            </li>
            <li>
              <strong>Passeios e inscrições</strong>: passeios que crias ou em que te inscreves,
              e respectivos critérios.
            </li>
            <li>
              <strong>Notificações push</strong>: identificador técnico da subscrição do teu
              dispositivo (sem conteúdo pessoal adicional), se activares notificações.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">3. Para que usamos estes dados</h2>
          <ul className="list-disc pl-5">
            <li>Criar e gerir a tua conta e autenticação</li>
            <li>Permitir a organização e inscrição em passeios</li>
            <li>Filtrar passeios por critérios de elegibilidade que tu ou outros definam</li>
            <li>Enviar notificações relacionadas com a tua actividade na plataforma</li>
            <li>Garantir a segurança e o funcionamento correcto do serviço</li>
          </ul>
          <p className="mt-2">
            Não vendemos nem partilhamos os teus dados com terceiros para fins de publicidade.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">4. Base legal</h2>
          <p>
            Tratamos os teus dados com base na <strong>execução do contrato</strong> que aceitas
            ao criares conta (prestação do serviço Ride2gether) e, para os campos opcionais
            (NIF, motas, contacto), com base no teu <strong>consentimento</strong>, que podes
            retirar a qualquer momento eliminando esses dados no teu perfil.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">
            5. Com quem partilhamos os dados
          </h2>
          <p>Usamos os seguintes prestadores de serviços (subcontratantes) para operar a plataforma:</p>
          <ul className="mt-2 list-disc pl-5">
            <li>
              <strong>Supabase</strong> (base de dados e autenticação) — servidores na União
              Europeia (Irlanda).
            </li>
            <li>
              <strong>Vercel</strong> (alojamento do site) — empresa norte-americana; os pedidos
              podem ser processados através da sua rede global de infra-estrutura.
            </li>
            <li>
              <strong>Resend</strong> (envio de e-mails transaccionais, ex.: confirmação de
              conta) — empresa norte-americana.
            </li>
          </ul>
          <p className="mt-2">
            Estes prestadores só têm acesso aos dados estritamente necessários para prestar o
            respectivo serviço.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">
            6. Quanto tempo guardamos os dados
          </h2>
          <p>
            Enquanto a tua conta estiver activa. Se pedires a eliminação da conta, apagamos os
            teus dados pessoais, salvo o que formos legalmente obrigados a conservar por mais
            tempo (ex.: obrigações fiscais associadas ao NIF do clube).
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">7. Os teus direitos</h2>
          <p>Ao abrigo do RGPD, tens direito a:</p>
          <ul className="mt-2 list-disc pl-5">
            <li>Aceder aos dados que temos sobre ti</li>
            <li>Corrigir dados incorrectos ou desactualizados</li>
            <li>Pedir a eliminação dos teus dados (&ldquo;direito ao esquecimento&rdquo;)</li>
            <li>Pedir a portabilidade dos teus dados</li>
            <li>Opor-te a determinados tratamentos ou retirar o consentimento dado</li>
            <li>
              Apresentar reclamação junto da{' '}
              <a
                href="https://www.cnpd.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ride-green underline"
              >
                CNPD — Comissão Nacional de Protecção de Dados
              </a>
            </li>
          </ul>
          <p className="mt-2">
            Para exercer qualquer destes direitos, contacta-nos através de{' '}
            <a href="mailto:fjamacedo@gmail.com" className="text-ride-green underline">
              fjamacedo@gmail.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">8. Cookies</h2>
          <p>
            Usamos apenas um cookie técnico e essencial, para manteres a sessão iniciada. Não
            usamos cookies de publicidade ou de terceiros para seguimento (tracking).
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">9. Segurança</h2>
          <p>
            Os dados são protegidos por controlo de acesso ao nível da base de dados (cada
            utilizador só acede aos dados a que tem direito) e comunicação encriptada (HTTPS)
            entre o teu dispositivo e os nossos servidores.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">10. Menores de idade</h2>
          <p>
            O serviço não se destina a menores de 16 anos sem o consentimento de quem exerça a
            responsabilidade parental.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-neutral-900">11. Alterações a esta política</h2>
          <p>
            Este documento pode ser actualizado à medida que o serviço evolui (nomeadamente nas
            fases seguintes de pagamentos e marketplace). Alterações relevantes serão comunicadas
            através da plataforma.
          </p>
        </section>
      </div>
    </main>
  )
}
