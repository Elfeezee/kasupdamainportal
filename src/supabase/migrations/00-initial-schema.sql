
-- Checks if the public.users table exists.
-- If it doesn't, it creates the table.
-- This ensures that the subsequent trigger creation will not fail
-- due to a missing table.
create table if not exists public.users (
  uid uuid not null primary key,
  name text,
  email text,
  phone text,
  role text default 'Applicant'::text,
  din text,
  created_at timestamp with time zone default now()
);

-- 1. Create the function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Insert a new row into the public.users table
  insert into public.users (uid, name, email, phone, role, created_at)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.phone,
    'Applicant', -- Default role
    new.created_at
  );
  return new;
end;
$$;

-- 2. Create the trigger
-- Drop the trigger if it already exists to prevent errors on re-run
drop trigger if exists on_auth_user_created on auth.users;
-- Create the trigger that calls the function
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

