-- Ride2gether — até 2 motas por utilizador (marca, modelo, ano, cilindrada).
--
-- Decisão (registada em conversa com o cliente): a matrícula NÃO é recolhida
-- nesta fase — é dado pessoal identificável sem uso definido até existir o
-- marketplace (Fase 3), e recolhê-la agora violaria o princípio de
-- minimização de dados do RGPD. A cilindrada mantém-se (não fazia parte do
-- pedido original, mas é necessária para preservar a filtragem por
-- "intervalo de cilindrada" nos critérios de selecção de passeios, já
-- implementada na migration 0001 através de perfis.cilindrada_cc).

alter table public.perfis drop column if exists cilindrada_cc;
alter table public.perfis drop column if exists marca_moto;

create table public.motas (
  id uuid primary key default gen_random_uuid(),
  utilizador_id uuid not null references public.perfis(id) on delete cascade,
  marca text not null,
  modelo text,
  ano integer,
  cilindrada_cc integer,
  created_at timestamptz not null default now()
);

create index motas_utilizador_idx on public.motas (utilizador_id);

-- Máximo de 2 motas por utilizador.
create or replace function public.impor_limite_motas()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.motas where utilizador_id = new.utilizador_id) >= 2 then
    raise exception 'Cada utilizador só pode registar até 2 motas.';
  end if;
  return new;
end;
$$;

create trigger impor_limite_motas
  before insert on public.motas
  for each row execute function public.impor_limite_motas();

alter table public.motas enable row level security;

create policy "motas_select_proprio" on public.motas
  for select to authenticated using (utilizador_id = auth.uid());
create policy "motas_insert_proprio" on public.motas
  for insert to authenticated with check (utilizador_id = auth.uid());
create policy "motas_update_proprio" on public.motas
  for update to authenticated using (utilizador_id = auth.uid());
create policy "motas_delete_proprio" on public.motas
  for delete to authenticated using (utilizador_id = auth.uid());
