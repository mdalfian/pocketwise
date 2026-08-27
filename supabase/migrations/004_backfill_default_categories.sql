-- Add starter categories to users that already exist.
-- Safe to run more than once because duplicate categories are ignored.
insert into public.categories (user_id, name, kind)
select users.id, defaults.name, defaults.kind::public.transaction_type
from auth.users as users
cross join (
  values
    ('Gaji', 'income'),
    ('Bonus', 'income'),
    ('Makanan', 'expense'),
    ('Transportasi', 'expense'),
    ('Tagihan', 'expense'),
    ('Belanja', 'expense'),
    ('Hiburan', 'expense'),
    ('Kesehatan', 'expense')
) as defaults(name, kind)
on conflict (user_id, name) do nothing;
