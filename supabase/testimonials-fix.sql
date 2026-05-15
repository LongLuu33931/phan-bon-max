create extension if not exists "pgcrypto";

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  role text default '',
  province text default '',
  crop text default '',
  quote text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  avatar_url text,
  sort_order integer default 0,
  is_featured boolean default true,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.testimonials enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'testimonials'
      and policyname = 'Public can read active testimonials'
  ) then
    create policy "Public can read active testimonials" on public.testimonials
      for select using (is_active = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'testimonials'
      and policyname = 'Authenticated admins manage testimonials'
  ) then
    create policy "Authenticated admins manage testimonials" on public.testimonials
      for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  end if;
end $$;

grant usage on schema public to anon, authenticated;
grant select on public.testimonials to anon, authenticated;
grant insert, update, delete on public.testimonials to authenticated;

select pg_notify('pgrst', 'reload schema');
