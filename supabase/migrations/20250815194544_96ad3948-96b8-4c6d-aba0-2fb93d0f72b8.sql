-- Update RLS policies to use is_admin() instead of is_current_user_admin()
-- This fixes admin CRUD failures across tables

-- ACCOUNTS
DROP POLICY IF EXISTS "Only admins can delete accounts" ON public.accounts;
DROP POLICY IF EXISTS "Only admins can manage accounts" ON public.accounts;
DROP POLICY IF EXISTS "Only admins can update accounts" ON public.accounts;
DROP POLICY IF EXISTS "Only admins can view all accounts" ON public.accounts;

CREATE POLICY "Only admins can delete accounts"
ON public.accounts FOR DELETE
USING (public.is_admin());

CREATE POLICY "Only admins can manage accounts"
ON public.accounts FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update accounts"
ON public.accounts FOR UPDATE
USING (public.is_admin());

-- Keep public basic viewing as existing
-- (Assuming the previous public SELECT policy named "Public can view basic account info" remains)

-- USER_ACCOUNTS
DROP POLICY IF EXISTS "Only admins can manage user accounts" ON public.user_accounts;
CREATE POLICY "Only admins can manage user accounts"
ON public.user_accounts FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ACCOUNT_GAMES
DROP POLICY IF EXISTS "Only admins can manage account games" ON public.account_games;
CREATE POLICY "Only admins can manage account games"
ON public.account_games FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ACCOUNT_SLOTS
DROP POLICY IF EXISTS "Only admins can manage account slots" ON public.account_slots;
CREATE POLICY "Only admins can manage account slots"
ON public.account_slots FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- USERS can still update their own slots (keep existing policy)

-- GAMES
DROP POLICY IF EXISTS "Only admins can delete games" ON public.games;
DROP POLICY IF EXISTS "Only admins can insert games" ON public.games;
DROP POLICY IF EXISTS "Only admins can update games" ON public.games;

CREATE POLICY "Only admins can delete games"
ON public.games FOR DELETE
USING (public.is_admin());

CREATE POLICY "Only admins can insert games"
ON public.games FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update games"
ON public.games FOR UPDATE
USING (public.is_admin());

-- PAYMENTS
DROP POLICY IF EXISTS "Admins can manage payments" ON public.payments;
CREATE POLICY "Admins can manage payments"
ON public.payments FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- USER_ROLES (bootstrap management by admins who are defined via profiles.role)
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;
CREATE POLICY "Only admins can manage roles"
ON public.user_roles FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- PROFILES (allow admins to view all profiles via is_admin)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_admin());