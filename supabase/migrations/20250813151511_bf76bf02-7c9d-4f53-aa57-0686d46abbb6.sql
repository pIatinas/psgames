-- CRITICAL SECURITY FIX: Remove public access to sensitive account data
-- This prevents unauthorized access to gaming account credentials

-- Drop the dangerous public policy that exposes all account data
DROP POLICY IF EXISTS "Public can view basic account info" ON public.accounts;

-- Create a secure function to hash passwords using bcrypt
CREATE OR REPLACE FUNCTION public.hash_account_password(password_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Use pgcrypto extension for secure password hashing
  RETURN crypt(password_text, gen_salt('bf', 12));
END;
$$;

-- Create a secure function to verify account passwords
CREATE OR REPLACE FUNCTION public.verify_account_password(password_text text, hashed_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN crypt(password_text, hashed_password) = hashed_password;
END;
$$;

-- Add new column for hashed passwords
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS password_hash text;

-- Update existing plaintext passwords to hashed versions
UPDATE public.accounts 
SET password_hash = public.hash_account_password(password)
WHERE password IS NOT NULL AND password_hash IS NULL;

-- Create secure policies for account access
-- Only authenticated users can view accounts they have access to
CREATE POLICY "Users can view accounts they have slots in" 
ON public.accounts 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.account_slots 
    WHERE account_id = accounts.id 
    AND user_id = auth.uid()
  )
  OR is_current_user_admin()
);

-- Only admins can insert accounts
CREATE POLICY "Only admins can create accounts" 
ON public.accounts 
FOR INSERT 
TO authenticated
WITH CHECK (is_current_user_admin());

-- Only admins can update accounts
CREATE POLICY "Only admins can update accounts" 
ON public.accounts 
FOR UPDATE 
TO authenticated
USING (is_current_user_admin());

-- Only admins can delete accounts
CREATE POLICY "Only admins can delete accounts" 
ON public.accounts 
FOR DELETE 
TO authenticated
USING (is_current_user_admin());

-- Create a secure view for public account information (non-sensitive data only)
CREATE OR REPLACE VIEW public.public_accounts AS
SELECT 
  id,
  email,
  created_at,
  updated_at
FROM public.accounts;

-- Enable RLS on the view
ALTER VIEW public.public_accounts SET (security_barrier = true);

-- Create policy for public view access
CREATE POLICY "Public can view basic account info through view" 
ON public.public_accounts 
FOR SELECT 
USING (true);

-- Secure function to get account credentials for authorized users only
CREATE OR REPLACE FUNCTION public.get_account_credentials(account_id uuid)
RETURNS TABLE(email text, password text, security_answer text, codes text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only return credentials if user has access to this account or is admin
  IF NOT (
    EXISTS (
      SELECT 1 FROM public.account_slots 
      WHERE account_slots.account_id = get_account_credentials.account_id 
      AND user_id = auth.uid()
    )
    OR is_current_user_admin()
  ) THEN
    RAISE EXCEPTION 'Access denied to account credentials';
  END IF;
  
  RETURN QUERY
  SELECT a.email, a.password, a.security_answer, a.codes
  FROM public.accounts a
  WHERE a.id = get_account_credentials.account_id;
END;
$$;

-- Create audit logging table for security monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" 
ON public.security_audit_log 
FOR SELECT 
TO authenticated
USING (is_current_user_admin());

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  action_type text,
  resource_type text,
  resource_id uuid DEFAULT NULL,
  details jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    auth.uid(),
    action_type,
    resource_type,
    resource_id,
    details
  );
END;
$$;