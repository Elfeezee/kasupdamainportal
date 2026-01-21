-- Add Super Admin role and update policies

-- 1. Update applications policies to include Super Admin
DROP POLICY IF EXISTS "Allow admin full access" ON public.applications;
CREATE POLICY "Allow admin and super admin full access"
ON public.applications FOR ALL
USING (
  (SELECT role FROM public.users WHERE uid = auth.uid()) IN ('Admin', 'Super Admin')
)
WITH CHECK (
  (SELECT role FROM public.users WHERE uid = auth.uid()) IN ('Admin', 'Super Admin')
);

-- 2. Update users table policies
DROP POLICY IF EXISTS "Allow admin to read all users" ON public.users;
DROP POLICY IF EXISTS "Allow admin and super admin to read all users" ON public.users;
CREATE POLICY "Allow admin and super admin to read all users"
ON public.users FOR SELECT
USING (
  (SELECT role FROM public.users WHERE uid = auth.uid()) IN ('Admin', 'Super Admin')
);

DROP POLICY IF EXISTS "Allow users to read their own profile" ON public.users;
CREATE POLICY "Allow users to read their own profile"
ON public.users FOR SELECT
TO authenticated
USING (auth.uid() = uid);

DROP POLICY IF EXISTS "Allow admin to update user roles" ON public.users;
DROP POLICY IF EXISTS "Allow super admin to manage all users" ON public.users;
CREATE POLICY "Allow super admin to manage all users"
ON public.users FOR ALL
USING (
  (SELECT role FROM public.users WHERE uid = auth.uid()) = 'Super Admin'
)
WITH CHECK (
  (SELECT role FROM public.users WHERE uid = auth.uid()) = 'Super Admin'
);

-- 3. Update transactions policies
CREATE POLICY "Allow admin and super admin to view all transactions"
ON public.transactions FOR SELECT
USING (
  (SELECT role FROM public.users WHERE uid = auth.uid()) IN ('Admin', 'Super Admin', 'Finance')
);

-- Note: Finance role also added here for the finance dashboard
