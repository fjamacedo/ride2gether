-- Até aqui só a direcção podia remover um sócio (membros_delete_direccao).
-- Falta o sócio se poder desassociar a si próprio de um clube.
create policy "membros_delete_proprio" on public.clube_membros
  for delete to authenticated
  using (utilizador_id = auth.uid());
