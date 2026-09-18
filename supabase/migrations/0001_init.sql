-- Ride2gether — Fase 1
-- Modelo de dados conforme secção 5 da especificação MVP.
--
-- Simplificações assumidas nesta migration (a rever com o cliente):
--   * A especificação define âmbitos de visibilidade "distrital" e "regional" mas não modela
--     localização estruturada para o Utilizador (só para o Clube). Sem essa granularidade,
--     "distrital"/"regional" são tratados como "visível a qualquer utilizador autenticado" —
--     tal como "nacional"/"internacional"/"público". Só "privado" é filtrado (sócios do clube).
--   * Para os critérios de selecção (cilindrada/marca) produzirem "elegibilidade" real e não
--     apenas informativa, foram acrescentados os campos opcionais cilindrada_cc e marca_moto
--     ao perfil do utilizador — não estavam explicitamente no modelo de dados da secção 5.

create extension if not exists "pgcrypto";

-- 1. Perfis (1:1 com auth.users)
create table public.perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  contacto text,
  nif text,
  tipo_perfil text not null default 'independente'
    check (tipo_perfil in ('direccao_clube', 'socio', 'independente')),
  cilindrada_cc integer,
  marca_moto text,
  created_at timestamptz not null default now()
);

-- 2. Clubes
create table public.clubes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  localizacao text,
  nif text not null unique,
  responsavel_id uuid not null references public.perfis(id),
  data_registo timestamptz not null default now()
);

-- 3. Associação sócio <-> clube (n:m, com estado)
create table public.clube_membros (
  clube_id uuid not null references public.clubes(id) on delete cascade,
  utilizador_id uuid not null references public.perfis(id) on delete cascade,
  estado text not null default 'activo' check (estado in ('activo', 'inactivo')),
  data_adesao timestamptz not null default now(),
  primary key (clube_id, utilizador_id)
);

-- 4. Passeios
create table public.passeios (
  id uuid primary key default gen_random_uuid(),
  organizador_clube_id uuid references public.clubes(id) on delete cascade,
  organizador_utilizador_id uuid references public.perfis(id) on delete cascade,
  titulo text not null,
  data timestamptz not null,
  local text not null,
  descricao text,
  rota text,
  ambito_visibilidade text not null
    check (ambito_visibilidade in ('privado', 'distrital', 'regional', 'nacional', 'internacional', 'publico')),
  max_participantes integer,
  cilindrada_min integer,
  cilindrada_max integer,
  marca text,
  created_at timestamptz not null default now(),
  constraint um_so_organizador check (
    (organizador_clube_id is not null and organizador_utilizador_id is null)
    or (organizador_clube_id is null and organizador_utilizador_id is not null)
  )
);

-- 5. Inscrições
create table public.inscricoes (
  id uuid primary key default gen_random_uuid(),
  passeio_id uuid not null references public.passeios(id) on delete cascade,
  utilizador_id uuid not null references public.perfis(id) on delete cascade,
  estado text not null default 'inscrito' check (estado in ('inscrito', 'confirmado')),
  created_at timestamptz not null default now(),
  unique (passeio_id, utilizador_id)
);

-- 6. Notificações (registo de envio; o envio real vai por Web Push)
create table public.notificacoes (
  id uuid primary key default gen_random_uuid(),
  passeio_id uuid not null references public.passeios(id) on delete cascade,
  destinatario_id uuid not null references public.perfis(id) on delete cascade,
  estado_envio text not null default 'pendente' check (estado_envio in ('pendente', 'enviado', 'falhado')),
  created_at timestamptz not null default now()
);

-- 7. Subscrições Web Push (necessário para notificações; não estava na secção 5)
create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  utilizador_id uuid not null references public.perfis(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

create index passeios_data_idx on public.passeios (data);
create index passeios_organizador_clube_idx on public.passeios (organizador_clube_id);
create index inscricoes_passeio_idx on public.inscricoes (passeio_id);
create index clube_membros_utilizador_idx on public.clube_membros (utilizador_id);

-- Função util: o utilizador é sócio activo de um clube?
create or replace function public.e_membro_activo(p_clube_id uuid, p_utilizador_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.clube_membros
    where clube_id = p_clube_id
      and utilizador_id = p_utilizador_id
      and estado = 'activo'
  );
$$;

-- Função util: o utilizador dirige (é responsável de) o clube?
create or replace function public.dirige_clube(p_clube_id uuid, p_utilizador_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.clubes
    where id = p_clube_id and responsavel_id = p_utilizador_id
  );
$$;

alter table public.perfis enable row level security;
alter table public.clubes enable row level security;
alter table public.clube_membros enable row level security;
alter table public.passeios enable row level security;
alter table public.inscricoes enable row level security;
alter table public.notificacoes enable row level security;
alter table public.push_subscriptions enable row level security;

-- Perfis: qualquer autenticado pode ler perfis básicos (necessário para listas de inscritos/sócios);
-- só o próprio pode editar o seu perfil.
create policy "perfis_select_autenticados" on public.perfis
  for select to authenticated using (true);
create policy "perfis_insert_proprio" on public.perfis
  for insert to authenticated with check (id = auth.uid());
create policy "perfis_update_proprio" on public.perfis
  for update to authenticated using (id = auth.uid());

-- Clubes: leitura pública (para se poder pesquisar/associar); escrita só pelo responsável.
create policy "clubes_select_todos" on public.clubes
  for select to authenticated using (true);
create policy "clubes_insert_responsavel" on public.clubes
  for insert to authenticated with check (responsavel_id = auth.uid());
create policy "clubes_update_responsavel" on public.clubes
  for update to authenticated using (responsavel_id = auth.uid());

-- Membros: o próprio vê a sua adesão; a direcção do clube vê/gere todos os sócios do seu clube.
create policy "membros_select_proprio_ou_direccao" on public.clube_membros
  for select to authenticated
  using (utilizador_id = auth.uid() or public.dirige_clube(clube_id, auth.uid()));
create policy "membros_insert_proprio_ou_direccao" on public.clube_membros
  for insert to authenticated
  with check (utilizador_id = auth.uid() or public.dirige_clube(clube_id, auth.uid()));
create policy "membros_update_direccao" on public.clube_membros
  for update to authenticated
  using (public.dirige_clube(clube_id, auth.uid()));
create policy "membros_delete_direccao" on public.clube_membros
  for delete to authenticated
  using (public.dirige_clube(clube_id, auth.uid()));

-- Passeios: visibilidade conforme âmbito (ver nota de simplificação no topo do ficheiro);
-- escrita só pelo organizador (clube que dirige, ou utilizador individual).
create policy "passeios_select_visibilidade" on public.passeios
  for select to authenticated
  using (
    ambito_visibilidade <> 'privado'
    or (organizador_clube_id is not null and public.e_membro_activo(organizador_clube_id, auth.uid()))
    or (organizador_utilizador_id = auth.uid())
  );
create policy "passeios_insert_organizador" on public.passeios
  for insert to authenticated
  with check (
    (organizador_utilizador_id = auth.uid())
    or (organizador_clube_id is not null and public.dirige_clube(organizador_clube_id, auth.uid()))
  );
create policy "passeios_update_organizador" on public.passeios
  for update to authenticated
  using (
    (organizador_utilizador_id = auth.uid())
    or (organizador_clube_id is not null and public.dirige_clube(organizador_clube_id, auth.uid()))
  );
create policy "passeios_delete_organizador" on public.passeios
  for delete to authenticated
  using (
    (organizador_utilizador_id = auth.uid())
    or (organizador_clube_id is not null and public.dirige_clube(organizador_clube_id, auth.uid()))
  );

-- Inscrições: o próprio utilizador inscreve-se/vê as suas inscrições; o organizador do passeio
-- vê a lista de inscritos.
create policy "inscricoes_select_proprio_ou_organizador" on public.inscricoes
  for select to authenticated
  using (
    utilizador_id = auth.uid()
    or exists (
      select 1 from public.passeios p
      where p.id = passeio_id
        and (
          p.organizador_utilizador_id = auth.uid()
          or (p.organizador_clube_id is not null and public.dirige_clube(p.organizador_clube_id, auth.uid()))
        )
    )
  );
create policy "inscricoes_insert_proprio" on public.inscricoes
  for insert to authenticated with check (utilizador_id = auth.uid());
create policy "inscricoes_delete_proprio" on public.inscricoes
  for delete to authenticated using (utilizador_id = auth.uid());

-- Notificações: só o destinatário vê as suas.
create policy "notificacoes_select_proprio" on public.notificacoes
  for select to authenticated using (destinatario_id = auth.uid());

-- Subscrições push: só o próprio utilizador gere as suas.
create policy "push_subscriptions_proprio" on public.push_subscriptions
  for all to authenticated
  using (utilizador_id = auth.uid())
  with check (utilizador_id = auth.uid());

-- Função util: procurar um perfil pelo e-mail de autenticação, para a direcção
-- de um clube poder adicionar um sócio já registado na plataforma sem que a
-- tabela `perfis` precise de expor o e-mail de todos a todos os autenticados
-- (a função é security definer e só devolve id/nome de UMA correspondência exacta).
create or replace function public.procurar_perfil_por_email(p_email text)
returns table (id uuid, nome text)
language sql
stable
security definer
set search_path = public, auth
as $$
  select p.id, p.nome
  from public.perfis p
  join auth.users u on u.id = p.id
  where lower(u.email) = lower(p_email)
  limit 1;
$$;

revoke all on function public.procurar_perfil_por_email(text) from public;
grant execute on function public.procurar_perfil_por_email(text) to authenticated;

-- Trigger: criar perfil automaticamente após registo em auth.users.
create or replace function public.criar_perfil_apos_registo()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfis (id, nome, tipo_perfil)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', new.email),
    coalesce(new.raw_user_meta_data->>'tipo_perfil', 'independente')
  );
  return new;
end;
$$;

create trigger criar_perfil_apos_registo
  after insert on auth.users
  for each row execute function public.criar_perfil_apos_registo();
