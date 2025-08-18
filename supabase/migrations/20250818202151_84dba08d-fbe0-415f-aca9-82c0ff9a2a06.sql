-- Add password to accounts and banner_url to profiles
ALTER TABLE public.accounts
ADD COLUMN IF NOT EXISTS password text;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS banner_url text;