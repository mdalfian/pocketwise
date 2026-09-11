create or replace function public.create_transaction_and_update_balance(
  p_account_id uuid,
  p_category_id uuid,
  p_group_id uuid,
  p_type public.transaction_type,
  p_amount bigint,
  p_description text,
  p_transaction_date date
) returns public.transactions
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_transaction public.transactions;
  v_user_id uuid := auth.uid();
  v_delta bigint;
begin
  if v_user_id is null then raise exception 'Unauthorized'; end if;
  if p_amount <= 0 then raise exception 'Amount must be positive'; end if;
  if not exists (select 1 from public.accounts where id = p_account_id and user_id = v_user_id) then raise exception 'Account not found'; end if;
  if p_category_id is not null and not exists (select 1 from public.categories where id = p_category_id and user_id = v_user_id) then raise exception 'Category not found'; end if;
  if p_group_id is not null and not exists (select 1 from public.transaction_groups where id = p_group_id and user_id = v_user_id) then raise exception 'Transaction group not found'; end if;

  v_delta := case when p_type = 'income' then p_amount when p_type = 'expense' then -p_amount else 0 end;
  insert into public.transactions (user_id, account_id, category_id, group_id, type, amount, description, transaction_date)
  values (v_user_id, p_account_id, p_category_id, p_group_id, p_type, p_amount, p_description, p_transaction_date)
  returning * into v_transaction;
  update public.accounts set balance = balance + v_delta, updated_at = now() where id = p_account_id and user_id = v_user_id;
  return v_transaction;
end;
$$;

grant execute on function public.create_transaction_and_update_balance(uuid, uuid, uuid, public.transaction_type, bigint, text, date) to authenticated;
