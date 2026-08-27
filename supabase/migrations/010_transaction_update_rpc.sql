create or replace function public.update_transaction_and_update_balance(p_transaction_id uuid, p_account_id uuid, p_category_id uuid, p_type public.transaction_type, p_amount bigint, p_description text, p_transaction_date date)
returns public.transactions language plpgsql security invoker set search_path = public as $$
declare v_user_id uuid := auth.uid(); v_old public.transactions; v_new public.transactions; v_old_delta bigint; v_new_delta bigint;
begin
  if v_user_id is null then raise exception 'Unauthorized'; end if;
  if p_amount <= 0 then raise exception 'Amount must be positive'; end if;
  select * into v_old from public.transactions where id = p_transaction_id and user_id = v_user_id for update;
  if v_old.id is null then raise exception 'Transaction not found'; end if;
  if p_type = 'transfer' then raise exception 'Transfer edit is not supported'; end if;
  if not exists (select 1 from public.accounts where id = p_account_id and user_id = v_user_id) then raise exception 'Account not found'; end if;
  v_old_delta := case when v_old.type = 'income' then -v_old.amount else v_old.amount end;
  v_new_delta := case when p_type = 'income' then p_amount else -p_amount end;
  update public.accounts set balance = balance + v_old_delta where id = v_old.account_id and user_id = v_user_id;
  update public.accounts set balance = balance + v_new_delta, updated_at = now() where id = p_account_id and user_id = v_user_id;
  update public.transactions set account_id = p_account_id, category_id = p_category_id, type = p_type, amount = p_amount, description = p_description, transaction_date = p_transaction_date where id = p_transaction_id and user_id = v_user_id returning * into v_new;
  return v_new;
end;
$$;
grant execute on function public.update_transaction_and_update_balance(uuid, uuid, uuid, public.transaction_type, bigint, text, date) to authenticated;
