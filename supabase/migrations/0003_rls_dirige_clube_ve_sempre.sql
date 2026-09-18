-- A direcção de um clube deve ver sempre os passeios do seu clube, mesmo que
-- (por algum motivo, ex.: clubes criados antes da correcção em
-- lib/data/clube.ts) não exista uma linha correspondente em clube_membros.
drop policy if exists "passeios_select_visibilidade" on public.passeios;

create policy "passeios_select_visibilidade" on public.passeios
  for select to authenticated
  using (
    ambito_visibilidade <> 'privado'
    or (organizador_clube_id is not null and public.e_membro_activo(organizador_clube_id, auth.uid()))
    or (organizador_clube_id is not null and public.dirige_clube(organizador_clube_id, auth.uid()))
    or (organizador_utilizador_id = auth.uid())
  );
