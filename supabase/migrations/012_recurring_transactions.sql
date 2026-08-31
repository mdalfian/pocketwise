create table public.recurring_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  type public.transaction_type not null check (type in ('income', 'expense')),
  amount bigint not null check (amount > 0),
  description text not null default 'Transaksi berulang',
  frequency text not null check (frequency in ('monthly', 'weekly')),
  next_run date not null,
  end_date date,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or end_date >= next_run)
);

create index recurring_transactions_due_idx on public.recurring_transactions(user_id, active, next_run);
alter table public.recurring_transactions enable row level security;
create policy "recurring transactions own data" on public.recurring_transactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.process_due_recurring_transactions()
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  item record;
  created_count integer := 0;
  run_date date;
  next_date date;
begin
  for item in
    select * from public.recurring_transactions
    where user_id = auth.uid() and active and next_run <= current_date
    order by next_run
    for update
  loop
    run_date := item.next_run;
    while run_date <= current_date and (item.end_date is null or run_date <= item.end_date) loop
      insert into public.transactions (user_id, account_id, category_id, type, amount, description, transaction_date)
      values (item.user_id, item.account_id, item.category_id, item.type, item.amount, item.description, run_date);
      if item.type = 'income' then
        update public.accounts set balance = balance + item.amount where id = item.account_id and user_id = item.user_id;
      else
        update public.accounts set balance = balance - item.amount where id = item.account_id and user_id = item.user_id;
      end if;
      created_count := created_count + 1;
      run_date := case when item.frequency = 'weekly' then run_date + 7 else (run_date + interval '1 month')::date end;
    end loop;
    update public.recurring_transactions
    set next_run = run_date, active = (item.end_date is null or run_date <= item.end_date), updated_at = now()
    where id = item.id;
  end loop;
  return created_count;
end;
$$;

grant execute on function public.process_due_recurring_transactions() to authenticated;
