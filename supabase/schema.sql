create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text default '',
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  sku text not null,
  price integer not null default 0,
  origin text default 'Việt Nam',
  shelf_life text default '24 tháng',
  short_description text not null default '',
  description text not null default '',
  specs jsonb not null default '[]'::jsonb,
  benefits jsonb not null default '[]'::jsonb,
  usage_rows jsonb not null default '[]'::jsonb,
  reasons jsonb not null default '[]'::jsonb,
  note text,
  thumbnail_url text,
  images jsonb not null default '[]'::jsonb,
  is_featured boolean default false,
  is_active boolean default true,
  sort_order integer default 0,
  related_slugs text[] default '{}',
  seo_title text,
  seo_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text default '',
  content text default '',
  cover_image_url text,
  seo_title text,
  seo_description text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

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

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  customer_name text not null,
  phone text not null,
  address text not null,
  province text not null,
  note text,
  status text not null default 'new' check (status in ('new', 'confirmed', 'shipping', 'completed', 'cancelled')),
  total_amount integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name_snapshot text not null,
  price_snapshot integer not null,
  quantity integer not null,
  line_total integer not null
);

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

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.posts enable row level security;
alter table public.testimonials enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;

create policy "Public can read active categories" on public.categories
  for select using (is_active = true);

create policy "Public can read active products" on public.products
  for select using (is_active = true);

create policy "Public can read published posts" on public.posts
  for select using (status = 'published');

create policy "Public can read active testimonials" on public.testimonials
  for select using (is_active = true);

create policy "Public can read settings" on public.site_settings
  for select using (true);

create policy "Authenticated admins manage categories" on public.categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated admins manage products" on public.products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated admins manage posts" on public.posts
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated admins manage testimonials" on public.testimonials
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated admins read orders" on public.orders
  for select using (auth.role() = 'authenticated');

create policy "Authenticated admins update orders" on public.orders
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Public creates orders" on public.orders
  for insert with check (true);

create policy "Authenticated admins read order items" on public.order_items
  for select using (auth.role() = 'authenticated');

create policy "Public creates order items" on public.order_items
  for insert with check (true);

create policy "Public creates contact messages" on public.contact_messages
  for insert with check (true);

create policy "Authenticated admins read contact messages" on public.contact_messages
  for select using (auth.role() = 'authenticated');

create policy "Authenticated admins update contact messages" on public.contact_messages
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public can read product images'
  ) then
    create policy "Public can read product images" on storage.objects
      for select using (bucket_id = 'product-images');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated admins upload product images'
  ) then
    create policy "Authenticated admins upload product images" on storage.objects
      for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated admins update product images'
  ) then
    create policy "Authenticated admins update product images" on storage.objects
      for update using (bucket_id = 'product-images' and auth.role() = 'authenticated')
      with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated admins delete product images'
  ) then
    create policy "Authenticated admins delete product images" on storage.objects
      for delete using (bucket_id = 'product-images' and auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public can read site assets'
  ) then
    create policy "Public can read site assets" on storage.objects
      for select using (bucket_id = 'site-assets');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated admins upload site assets'
  ) then
    create policy "Authenticated admins upload site assets" on storage.objects
      for insert with check (bucket_id = 'site-assets' and auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated admins update site assets'
  ) then
    create policy "Authenticated admins update site assets" on storage.objects
      for update using (bucket_id = 'site-assets' and auth.role() = 'authenticated')
      with check (bucket_id = 'site-assets' and auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated admins delete site assets'
  ) then
    create policy "Authenticated admins delete site assets" on storage.objects
      for delete using (bucket_id = 'site-assets' and auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public can read post images'
  ) then
    create policy "Public can read post images" on storage.objects
      for select using (bucket_id = 'post-images');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated admins upload post images'
  ) then
    create policy "Authenticated admins upload post images" on storage.objects
      for insert with check (bucket_id = 'post-images' and auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated admins update post images'
  ) then
    create policy "Authenticated admins update post images" on storage.objects
      for update using (bucket_id = 'post-images' and auth.role() = 'authenticated')
      with check (bucket_id = 'post-images' and auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated admins delete post images'
  ) then
    create policy "Authenticated admins delete post images" on storage.objects
      for delete using (bucket_id = 'post-images' and auth.role() = 'authenticated');
  end if;
end $$;
