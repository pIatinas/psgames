
-- Add the active column to the profiles table
ALTER TABLE public.profiles ADD COLUMN active boolean NOT NULL DEFAULT false;
