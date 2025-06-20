-- Create Users table
create table if not exists public.users (
  id uuid not null default uuid_generate_v4() primary key,
  created_at timestamp with time zone not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  address text,
  notes text,
  source_page text not null,
  source_id text,
  source_name text,
  people integer not null default 1,
  date date not null,
  price numeric,
  status text not null default 'pending'
);

-- Add indexes for better performance
create index if not exists users_email_idx on public.users (email);
create index if not exists users_source_page_idx on public.users (source_page);
create index if not exists users_status_idx on public.users (status);

-- Add unique constraint to prevent duplicate submissions
-- (same person, same email, same source, same date)
create unique index if not exists users_unique_submission_idx on 
  public.users (email, source_page, source_id, date);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Create policies
-- Allow anonymous users to insert data
create policy "Allow anonymous insert" on public.users
  for insert to anon
  with check (true);

-- Allow authenticated users to read all data
create policy "Allow authenticated read" on public.users
  for select to authenticated
  using (true);

-- Allow authenticated users to update data
create policy "Allow authenticated update" on public.users
  for update to authenticated
  using (true);

-- Add comment to table
comment on table public.users is 'Table to store user submissions from package and experience details pages';