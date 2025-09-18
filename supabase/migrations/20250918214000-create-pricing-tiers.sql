-- Create pricing_tiers table (simplified: people_count + price only)
create table if not exists public.pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  trip_id integer references public.trips(id) on delete cascade,
  experience_id uuid references public.experiences(id) on delete cascade,
  people_count int not null,           -- e.g., 1,2,3
  price numeric not null,
  currency text not null default 'USD',
  sort_order int not null default 1,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_pricing_tiers_trip on public.pricing_tiers(trip_id);
create index if not exists idx_pricing_tiers_experience on public.pricing_tiers(experience_id);

-- Prevent duplicate rows per target/people_count
do $$
begin
  if not exists (
    select 1 from pg_indexes where schemaname = 'public' and indexname = 'uq_pricing_tiers_trip_people'
  ) then
    execute 'create unique index uq_pricing_tiers_trip_people on public.pricing_tiers(trip_id, people_count) where trip_id is not null';
  end if;
  if not exists (
    select 1 from pg_indexes where schemaname = 'public' and indexname = 'uq_pricing_tiers_exp_people'
  ) then
    execute 'create unique index uq_pricing_tiers_exp_people on public.pricing_tiers(experience_id, people_count) where experience_id is not null';
  end if;
end $$;

-- Ensure at least one of trip_id or experience_id is set
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'pricing_tiers_target_chk'
  ) then
    alter table public.pricing_tiers
      add constraint pricing_tiers_target_chk
      check (trip_id is not null or experience_id is not null);
  end if;
end $$;
