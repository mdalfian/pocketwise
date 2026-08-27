create or replace function public.create_transfer_and_update_balances(
  p_from_account_id uuid,
  p_to_account_id uuid,
  p_amount bigint,
  p_description text,
  p_transaction_date date
) returns setof public.transactions
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_from public.accounts;
  v_to public.accounts;
begin
  if v_user_id is null then raise exception 'Unauthorized'; end if;
  if p_from_account_id = p_to_account_id then raise exception 'Accounts must be different'; end if;
  if p_amount <= 0 then raise exception 'Amount must be positive'; end if;
  select * into v_from from public.accounts where id = p_from_account_id and user_id = v_user_id for update;
  select * into v_to from public.accounts where id = p_to_account_id and user_id = v_user_id for update;
  if v_from.id is null or v_to.id is null then raise exception 'Account not found'; end if;
  if v_from.balance < p_amount then raise exception 'Insufficient balance'; end if;
  update public.accounts set balance = balance - p_amount, updated_at = now() where id = v_from.id;
  update public.accounts set balance = balance + p_amount, updated_at = now() where id = v_to.id;
  return query insert into public.transactions (user_id, account_id, type, amount, description, transaction_date)
    values (v_user_id, v_from.id, 'transfer', p_amount, coalesce(nullif(trim(p_description), ''), 'Transfer ke ' || v_to.name), p_transaction_date) returning *;
  return query insert into public.transactions (user_id, account_id, type, amount, description, transaction_date)
    values (v_user_id, v_to.id, 'transfer', p_amount, coalesce(nullif(trim(p_description), ''), 'Transfer dari ' || v_from.name), p_transaction_date) returning *;
end;
$$;

grant execute on function public.create_transfer_and_update_balances(uuid, uuid, bigint, text, date) to authenticated;
