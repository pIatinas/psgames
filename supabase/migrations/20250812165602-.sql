-- Add new game trophy and launch date fields if not exist
ALTER TABLE public.games
  ADD COLUMN IF NOT EXISTS platinum integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gold integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS silver integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bronze integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS launch_date date;

-- Create payments table for membership dues
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  month integer NOT NULL CHECK (month BETWEEN 1 AND 12),
  year integer NOT NULL,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  paid_at timestamp with time zone,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('paid','pending')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflict)
DROP POLICY IF EXISTS "Admins can manage payments" ON public.payments;
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;

-- Create policies: admins manage all, users can view own
CREATE POLICY "Admins can manage payments"
ON public.payments
FOR ALL
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

CREATE POLICY "Users can view their own payments"
ON public.payments
FOR SELECT
USING (auth.uid() = member_id);

-- Create trigger to update updated_at
CREATE OR REPLACE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();