# Ride2gether

MVP Fase 1 — gestão associativa de motoclubes e organização de passeios,
sem pagamentos, marketplace ou rede de parceiros (adiados para fases
posteriores). Documento de especificação partilhado à parte com o autor.

Stack: Next.js 16 (App Router, TypeScript, Tailwind) + Supabase (Postgres,
Auth, RLS) + Web Push (VAPID), alojado em Vercel + Supabase (região UE —
Frankfurt).

## Estado actual

Implementado e verificado (`next build`, `tsc --noEmit`, `eslint`):

- Registo/login (Supabase Auth)
- Dashboard do clube: registo, gestão de sócios (adicionar por e-mail,
  activar/inactivar, remover), CRUD de passeios
- Vista de motard (PWA): consulta/criação de passeios, inscrição, associação
  a clubes, perfil
- Notificações Web Push (subscrição; falta o disparo automático em eventos —
  ver "Por fazer")
- Manifest PWA + service worker + ícones **placeholder** (gerados
  programaticamente — substituir pelo ícone real da roda descrito na
  especificação de marca, secção 2.2)

**Ainda não testado contra um projecto Supabase real** — todo o código foi
validado com `tsc`/`eslint`/`next build` mas não corri contra uma base de
dados viva. Antes de mostrar isto a um utilizador real, siga os passos de
setup abaixo e teste o percurso completo (registo → criar clube → criar
passeio → inscrever-se) manualmente.

## Simplificações assumidas (a rever)

Documentadas também em comentários no código, junto de onde se aplicam:

- **Visibilidade "distrital"/"regional"**: a especificação define estes
  âmbitos mas não modela localização estruturada para o Utilizador (só para
  o Clube). Sem essa granularidade, tratei estes dois âmbitos como
  equivalentes a "visível a qualquer utilizador autenticado", tal como
  nacional/internacional/público. Só "privado" filtra de facto (sócios do
  clube). Ver `supabase/migrations/0001_init.sql`.
- **Elegibilidade por cilindrada/marca**: para os critérios de selecção do
  passeio produzirem filtragem real (não apenas informativa), acrescentei
  campos opcionais `cilindrada_cc`/`marca_moto` ao perfil do utilizador —
  não estavam no modelo de dados original da secção 5.
- **Adicionar sócio pelo dashboard**: só funciona se essa pessoa já se tiver
  registado na plataforma (procura por e-mail via função SQL dedicada). Não
  há fluxo de "convite" para quem ainda não tem conta.
- **Notificações push**: a subscrição do dispositivo está feita; falta
  ligar o disparo (ex.: ao criar um passeio, notificar sócios elegíveis) —
  a função `enviarPush` em `src/lib/push/vapid.ts` já está pronta para ser
  chamada a partir de onde isso for decidido.

## Setup — antes de correr localmente ou fazer deploy

### 1. Criar o projecto Supabase

1. Em [supabase.com](https://supabase.com), criar novo projecto
2. **Região: Frankfurt (eu-central-1)** — decisão já tomada de manter os
   dados na UE
3. Em SQL Editor, correr o conteúdo de `supabase/migrations/0001_init.sql`
   (ou usar `supabase db push` com o CLI, depois de `supabase link`)
4. Em Project Settings → API, copiar `Project URL` e `anon public key`

### 2. Gerar chaves VAPID (notificações push)

```bash
npx web-push generate-vapid-keys
```

### 3. Variáveis de ambiente

Copiar `.env.example` para `.env.local` e preencher:

```
NEXT_PUBLIC_SUPABASE_URL=<Project URL do Supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<chave pública gerada acima>
VAPID_PRIVATE_KEY=<chave privada gerada acima>
VAPID_SUBJECT=mailto:<o teu e-mail>
```

### 4. Correr localmente

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

### 5. Deploy (Vercel)

1. Importar o repositório em [vercel.com/new](https://vercel.com/new)
2. Adicionar as mesmas variáveis de ambiente do `.env.local` nas
   configurações do projecto Vercel
3. **Atenção**: o plano Hobby (grátis) da Vercel tem nos termos de serviço
   uma restrição a uso não-comercial — ver conversa sobre isto antes de
   abrir a plataforma a utilizadores reais fora de teste privado
4. Deploy

### 6. Domínio próprio (ride2gether.pt)

Depois de registado em dns.pt, apontar o domínio para a Vercel seguindo as
instruções que a Vercel apresenta em Project Settings → Domains.

## Por fazer antes de validar com utilizadores reais

- [ ] Testar o fluxo completo contra o Supabase real (não só build/lint)
- [ ] Substituir os ícones PWA placeholder pelo ícone real da marca
- [ ] Ligar o disparo de notificações push a eventos concretos (novo
      passeio elegível, lembrete, etc.)
- [ ] Política de privacidade (RGPD) — dados pessoais tratados: nome,
      contacto, NIF
- [ ] Decidir e documentar o fluxo de "convite" de sócios sem conta prévia
- [ ] Testar a instalação da PWA em iOS (limitação de push já conhecida e
      documentada na especificação)
