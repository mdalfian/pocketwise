-- PocketWise local demo seed.
-- Run with `supabase db reset` after creating at least one local Auth user.
-- The seed is idempotent for the demo names below.

do $$
declare
  demo_user uuid;
  demo_account uuid;
  food_category uuid;
  transport_category uuid;
  trip_group uuid;
begin
  select id into demo_user from auth.users order by created_at limit 1;

  if demo_user is null then
    raise notice 'Seed dilewati: belum ada user di auth.users.';
    return;
  end if;

  insert into public.accounts (user_id, name, balance, currency)
  values (demo_user, 'Rekening Demo', 4250000, 'IDR')
  on conflict do nothing;

  select id into demo_account
  from public.accounts
  where user_id = demo_user and name = 'Rekening Demo'
  order by created_at
  limit 1;

  insert into public.categories (user_id, name, kind)
  values
    (demo_user, 'Makanan', 'expense'),
    (demo_user, 'Transportasi', 'expense')
  on conflict (user_id, name) do update set kind = excluded.kind;

  select id into food_category from public.categories where user_id = demo_user and name = 'Makanan';
  select id into transport_category from public.categories where user_id = demo_user and name = 'Transportasi';

  insert into public.transaction_groups (user_id, name, description, start_date, end_date, color)
  values (demo_user, 'Trip Semarang', 'Contoh grup untuk transaksi perjalanan ke Semarang.', current_date - 2, current_date + 2, '#6a9a5f')
  on conflict do nothing;

  select id into trip_group
  from public.transaction_groups
  where user_id = demo_user and name = 'Trip Semarang'
  order by created_at
  limit 1;

  insert into public.transactions (user_id, account_id, category_id, group_id, type, amount, description, transaction_date)
  select demo_user, demo_account, food_category, trip_group, 'expense', 85000, 'Makan siang di Semarang', current_date - 1
  where not exists (
    select 1 from public.transactions
    where user_id = demo_user and group_id = trip_group and description = 'Makan siang di Semarang'
  );

  insert into public.transactions (user_id, account_id, category_id, group_id, type, amount, description, transaction_date)
  select demo_user, demo_account, transport_category, trip_group, 'expense', 120000, 'Bensin perjalanan', current_date
  where not exists (
    select 1 from public.transactions
    where user_id = demo_user and group_id = trip_group and description = 'Bensin perjalanan'
  );

  raise notice 'Seed selesai untuk user %.', demo_user;
end $$;
