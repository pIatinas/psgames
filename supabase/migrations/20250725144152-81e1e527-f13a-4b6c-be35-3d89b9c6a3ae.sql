-- Add password hashing functionality for account credentials
-- Create a function to hash passwords securely
CREATE OR REPLACE FUNCTION public.hash_password(password_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Use pgcrypto extension for secure password hashing
  RETURN crypt(password_text, gen_salt('bf', 12));
END;
$$;

-- Create a function to verify passwords
CREATE OR REPLACE FUNCTION public.verify_password(password_text text, hashed_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN crypt(password_text, hashed_password) = hashed_password;
END;
$$;

-- Enable the pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;