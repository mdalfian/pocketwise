create table public.transaction_groups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  description text,
  start_date date,
  end_date date,
  color text not null default '#6a9a5f',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (description is null or char_length(description) <= 240),
  check (end_date is null or start_date is null or end_date >= start_date),
  unique (id, user_id)
);

alter table public.transactions
  add column group_id uuid;

alter table public.transactions
  add constraint transactions_group_owner_fkey
  foreign key (group_id, user_id)
  references public.transaction_groups (id, user_id)
  on delete set null;

create index transaction_groups_user_created_idx
  on public.transaction_groups(user_id, created_at desc);

create index transactions_group_idx
  on public.transactions(group_id);

alter table public.transaction_groups enable row level security;

create policy "transaction groups own data"
  on public.transaction_groups
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
