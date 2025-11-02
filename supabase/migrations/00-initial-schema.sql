-- Create the users table
CREATE TABLE if not exists users (
  uid uuid REFERENCES auth.users(id) not null primary key,
  name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT default 'Applicant',
  created_at timestamptz default now()
);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (uid, name, email, phone)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.phone
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function when a new user signs up in Supabase Auth
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create storage bucket for application documents
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('application_documents', 'application_documents', false, 5242880, ARRAY['image/jpeg', 'image/png', 'application/pdf'])
on conflict (id) do nothing;

-- Policies for application_documents bucket
-- Allow authenticated users to upload
CREATE POLICY "Allow individual authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'application_documents');

-- Allow authenticated users to read their own files
CREATE POLICY "Allow individual authenticated read access"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'application_documents' AND auth.uid()::text = (storage.foldername(name))[1]);


-- Create applications table
CREATE TABLE if not exists applications (
  id uuid primary key default gen_random_uuid(),
  type TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  user_id uuid references auth.users(id),
  status TEXT NOT NULL DEFAULT 'Pending',
  data jsonb,
  rejection_reason TEXT,
  created_at timestamptz default now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own applications
CREATE POLICY "Allow individual user access to their own applications"
ON public.applications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow admin users full access
CREATE POLICY "Allow admin full access"
ON public.applications FOR ALL
USING (
  (SELECT role FROM public.users WHERE uid = auth.uid()) = 'Admin'
)
WITH CHECK (
  (SELECT role FROM public.users WHERE uid = auth.uid()) = 'Admin'
);


-- RLs for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin to read all users"
ON public.users FOR SELECT
USING (
  (SELECT role FROM public.users WHERE uid = auth.uid()) = 'Admin'
);

CREATE POLICY "Allow admin to update user roles"
ON public.users FOR UPDATE
USING (
  (SELECT role FROM public.users WHERE uid = auth.uid()) = 'Admin'
)
WITH CHECK (
  (SELECT role FROM public.users WHERE uid = auth.uid()) = 'Admin'
);
