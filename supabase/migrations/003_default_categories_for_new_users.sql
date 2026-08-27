-- Create a starter set of categories whenever a new user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      split_part(new.email, '@', 1)
    )
  );

  insert into public.categories (user_id, name, kind)
  values
    (new.id, 'Gaji', 'income'),
    (new.id, 'Bonus', 'income'),
    (new.id, 'Makanan', 'expense'),
    (new.id, 'Transportasi', 'expense'),
    (new.id, 'Tagihan', 'expense'),
    (new.id, 'Belanja', 'expense'),
    (new.id, 'Hiburan', 'expense'),
    (new.id, 'Kesehatan', 'expense');

  return new;
end;
$$;
