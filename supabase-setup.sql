create table if not exists public.site_content (
  id text primary key,
  content jsonb not null default '{"settings":{},"categories":[],"projects":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Conteudo publico pode ser lido" on public.site_content;
create policy "Conteudo publico pode ser lido"
on public.site_content
for select
to anon, authenticated
using (true);

drop policy if exists "Utilizadores autenticados podem inserir" on public.site_content;
create policy "Utilizadores autenticados podem inserir"
on public.site_content
for insert
to authenticated
with check (true);

drop policy if exists "Utilizadores autenticados podem actualizar" on public.site_content;
create policy "Utilizadores autenticados podem actualizar"
on public.site_content
for update
to authenticated
using (true)
with check (true);

insert into public.site_content (id, content)
values (
  'main',
  '{"settings":{"tagline":"Arquitetura e interiores, do conceito à obra.","intro":"Criamos espaços claros, funcionais e pensados para serem vividos.","contactHeading":"Um bom projecto começa por ouvir.","contactIntro":"Conta-nos um pouco sobre o projecto. Respondemos assim que possível.","email":"","phone":"","address":"Aveiro, Portugal","instagram":"","linkedin":"","website":"","footerNote":"Arquitetura e interiores, do conceito à obra."},"categories":[],"projects":[]}'::jsonb
)
on conflict (id) do nothing;

grant select on public.site_content to anon;
grant select, insert, update on public.site_content to authenticated;
