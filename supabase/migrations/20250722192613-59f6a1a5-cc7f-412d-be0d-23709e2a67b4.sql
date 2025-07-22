-- Fix security warnings by updating functions with proper search_path

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    CASE 
      WHEN NEW.email = 'wallace_erick@hotmail.com' THEN 'admin'
      ELSE 'member'
    END
  );
  RETURN NEW;
END;
$$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create security definer function to check if user is admin (to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Update RLS policies to use the security definer function
DROP POLICY IF EXISTS "Only admins can insert games" ON public.games;
DROP POLICY IF EXISTS "Only admins can update games" ON public.games;
DROP POLICY IF EXISTS "Only admins can delete games" ON public.games;
DROP POLICY IF EXISTS "Only admins can view all accounts" ON public.accounts;
DROP POLICY IF EXISTS "Only admins can manage accounts" ON public.accounts;
DROP POLICY IF EXISTS "Only admins can update accounts" ON public.accounts;
DROP POLICY IF EXISTS "Only admins can delete accounts" ON public.accounts;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Only admins can manage account games" ON public.account_games;
DROP POLICY IF EXISTS "Only admins can manage account slots" ON public.account_slots;
DROP POLICY IF EXISTS "Only admins can manage user accounts" ON public.user_accounts;

-- Recreate policies with security definer function
CREATE POLICY "Only admins can insert games" ON public.games FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update games" ON public.games FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete games" ON public.games FOR DELETE USING (public.is_admin());

CREATE POLICY "Only admins can view all accounts" ON public.accounts FOR SELECT USING (public.is_admin());
CREATE POLICY "Only admins can manage accounts" ON public.accounts FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update accounts" ON public.accounts FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete accounts" ON public.accounts FOR DELETE USING (public.is_admin());

CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());

CREATE POLICY "Only admins can manage account games" ON public.account_games FOR ALL USING (public.is_admin());
CREATE POLICY "Only admins can manage account slots" ON public.account_slots FOR ALL USING (public.is_admin());
CREATE POLICY "Only admins can manage user accounts" ON public.user_accounts FOR ALL USING (public.is_admin());