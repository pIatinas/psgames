-- Add password field to profiles table for manual password management
ALTER TABLE public.profiles ADD COLUMN password TEXT;