-- Fix overly permissive RLS policies

-- Update account_games policy to require authentication
DROP POLICY IF EXISTS "Anyone can view account games" ON public.account_games;
CREATE POLICY "Authenticated users can view account games" 
ON public.account_games 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Update account_slots policy to require authentication  
DROP POLICY IF EXISTS "Anyone can view account slots" ON public.account_slots;
CREATE POLICY "Authenticated users can view account slots" 
ON public.account_slots 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Update profiles policy to be more restrictive
DROP POLICY IF EXISTS "Anyone can view profiles for listing" ON public.profiles;
CREATE POLICY "Authenticated users can view active profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.role() = 'authenticated' AND active = true);

-- Add missing search_path to functions for security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean AS $$
  SELECT public.has_role(auth.uid(), 'admin'::app_role);
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = 'public';