create or replace function public.delete_transaction_and_update_balance(p_transaction_id uuid)
returns void language plpgsql security invoker set search_path = public as $$
declare v_user_id uuid := auth.uid(); v_transaction public.transactions;
begin
  if v_user_id is null then raise exception 'Unauthorized'; end if;
  select * into v_transaction from public.transactions where id = p_transaction_id and user_id = v_user_id for update;
  if v_transaction.id is null then raise exception 'Transaction not found'; end if;
  if v_transaction.type = 'income' then
    update public.accounts set balance = balance - v_transaction.amount, updated_at = now() where id = v_transaction.account_id and user_id = v_user_id;
  elsif v_transaction.type = 'expense' then
    update public.accounts set balance = balance + v_transaction.amount, updated_at = now() where id = v_transaction.account_id and user_id = v_user_id;
  end if;
  delete from public.transactions where id = v_transaction.id and user_id = v_user_id;
end;
$$;
grant execute on function public.delete_transaction_and_update_balance(uuid) to authenticated;
