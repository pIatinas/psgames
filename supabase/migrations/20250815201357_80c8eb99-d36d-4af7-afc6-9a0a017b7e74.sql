-- First, create a table to store payment history per member per month/year
CREATE TABLE public.member_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2020 AND year <= 2050),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue')),
  amount DECIMAL DEFAULT 0,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(member_id, month, year)
);

-- Enable RLS
ALTER TABLE public.member_payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for member_payments
CREATE POLICY "Admins can manage member payments" ON public.member_payments
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Users can view their own payments" ON public.member_payments
  FOR SELECT USING (auth.uid() = member_id);

-- Create trigger for updating updated_at
CREATE TRIGGER update_member_payments_updated_at
  BEFORE UPDATE ON public.member_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for account usage history to track when users activate/deactivate accounts
CREATE TABLE public.account_usage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slot_number INTEGER NOT NULL CHECK (slot_number IN (1, 2)),
  activated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  deactivated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.account_usage_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for account_usage_history
CREATE POLICY "Admins can manage account usage history" ON public.account_usage_history
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Users can view their own usage history" ON public.account_usage_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public can view usage history" ON public.account_usage_history
  FOR SELECT USING (true);