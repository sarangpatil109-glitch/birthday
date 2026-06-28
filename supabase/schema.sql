-- ============================================================
-- HeartNote Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- WEBSITES TABLE
-- ============================================================
create table if not exists public.websites (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  from_name   text not null default '',
  to_name     text not null default '',
  message     text not null default '',
  photos      text[] not null default '{}',
  video       text,
  song        text not null default 'piano',
  status      text not null default 'draft'
                check (status in ('draft', 'published')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index for slug lookups (used on every page load)
create index if not exists idx_websites_slug on public.websites (slug);
create index if not exists idx_websites_status on public.websites (status);
create index if not exists idx_websites_created_at on public.websites (created_at desc);

-- ============================================================
-- PAYMENTS TABLE
-- ============================================================
create table if not exists public.payments (
  id                   uuid primary key default gen_random_uuid(),
  website_id           uuid not null references public.websites (id) on delete cascade,
  cashfree_order_id    text unique not null,
  cashfree_payment_id  text,
  amount               integer not null default 99,
  status               text not null default 'pending'
                         check (status in ('pending', 'success', 'failed')),
  created_at           timestamptz not null default now()
);

create index if not exists idx_payments_website_id on public.payments (website_id);
create index if not exists idx_payments_order_id on public.payments (cashfree_order_id);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists websites_updated_at on public.websites;
create trigger websites_updated_at
  before update on public.websites
  for each row execute function public.update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.websites enable row level security;
alter table public.payments enable row level security;

-- Drop old policies if they exist
drop policy if exists "Allow public read of published websites" on public.websites;
drop policy if exists "Allow anon insert" on public.websites;
drop policy if exists "Allow service role full access on websites" on public.websites;
drop policy if exists "Allow service role full access on payments" on public.payments;
drop policy if exists "Allow anon insert on payments" on public.payments;

-- Websites: anyone can read published websites
create policy "Allow public read of published websites"
  on public.websites for select
  using (status = 'published');

-- Websites: service role has full access (used by server-side API routes)
create policy "Allow service role full access on websites"
  on public.websites for all
  using (auth.role() = 'service_role');

-- Payments: service role has full access
create policy "Allow service role full access on payments"
  on public.payments for all
  using (auth.role() = 'service_role');

-- ============================================================
-- STORAGE BUCKETS
-- Run these one by one in Supabase Dashboard > Storage
-- Or use the SQL below (requires storage schema access)
-- ============================================================

-- Create storage buckets (run individually if needed)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('photos', 'photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('videos', 'videos', true, 104857600, array['video/mp4', 'video/quicktime', 'video/webm']),
  ('songs',  'songs',  true, 10485760, array['audio/mpeg', 'audio/wav', 'audio/ogg'])
on conflict (id) do nothing;

-- Storage policies: allow public read
create policy "Allow public read on photos"
  on storage.objects for select
  using (bucket_id = 'photos');

create policy "Allow public read on videos"
  on storage.objects for select
  using (bucket_id = 'videos');

create policy "Allow public read on songs"
  on storage.objects for select
  using (bucket_id = 'songs');

-- Storage policies: allow service role to upload
create policy "Allow service role to upload photos"
  on storage.objects for insert
  with check (bucket_id = 'photos' and auth.role() = 'service_role');

create policy "Allow service role to upload videos"
  on storage.objects for insert
  with check (bucket_id = 'videos' and auth.role() = 'service_role');

create policy "Allow service role to upload songs"
  on storage.objects for insert
  with check (bucket_id = 'songs' and auth.role() = 'service_role');

-- ============================================================
-- DONE
-- ============================================================
