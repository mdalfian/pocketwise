-- Keep transaction descriptions safe for existing databases while allowing
-- the application to provide a friendly fallback when the field is empty.
alter table public.transactions
  drop constraint if exists transactions_description_check;

alter table public.transactions
  add constraint transactions_description_check
  check (char_length(description) between 1 and 240);