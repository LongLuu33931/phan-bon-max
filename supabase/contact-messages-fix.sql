create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  email text,
  province text,
  crop text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.contact_messages enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'contact_messages'
      and policyname = 'Public creates contact messages'
  ) then
    create policy "Public creates contact messages" on public.contact_messages
      for insert with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'contact_messages'
      and policyname = 'Authenticated admins read contact messages'
  ) then
    create policy "Authenticated admins read contact messages" on public.contact_messages
      for select using (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'contact_messages'
      and policyname = 'Authenticated admins update contact messages'
  ) then
    create policy "Authenticated admins update contact messages" on public.contact_messages
      for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  end if;
end $$;

grant usage on schema public to anon, authenticated;
grant insert on public.contact_messages to anon, authenticated;
grant select, update on public.contact_messages to authenticated;

select pg_notify('pgrst', 'reload schema');
