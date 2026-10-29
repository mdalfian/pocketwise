with ranked_expenses as (
  select
    id,
    user_id,
    account_id,
    amount,
    transaction_date,
    lower(trim(description)) as normalized_description,
    row_number() over (
      partition by user_id, transaction_date, amount, lower(trim(description))
      order by created_at, id
    ) as pair_number
  from public.transactions
  where type = 'expense'
    and transaction_date >= date '2026-10-01'
    and transaction_date < date '2026-11-01'
),
ranked_incomes as (
  select
    id,
    user_id,
    account_id,
    amount,
    transaction_date,
    lower(trim(description)) as normalized_description,
    row_number() over (
      partition by user_id, transaction_date, amount, lower(trim(description))
      order by created_at, id
    ) as pair_number
  from public.transactions
  where type = 'income'
    and transaction_date >= date '2026-10-01'
    and transaction_date < date '2026-11-01'
),
matched_pairs as (
  select
    expense.id as expense_id,
    income.id as income_id
  from ranked_expenses expense
  join ranked_incomes income
    on income.user_id = expense.user_id
    and income.transaction_date = expense.transaction_date
    and income.amount = expense.amount
    and income.normalized_description = expense.normalized_description
    and income.account_id <> expense.account_id
    and income.pair_number = expense.pair_number
)
update public.transactions transaction_row
set type = 'transfer', updated_at = now()
from matched_pairs
where transaction_row.id in (matched_pairs.expense_id, matched_pairs.income_id);
