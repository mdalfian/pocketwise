create table public.category_budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  month date not null,
  amount bigint not null check (amount > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, category_id, month)
);

create index category_budgets_user_month_idx on public.category_budgets(user_id, month);

alter table public.category_budgets enable row level security;
create policy "category budgets own data" on public.category_budgets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
