-- Adjust RLS policies to allow members to claim free slots and record usage

-- account_slots: allow users to claim a free slot (update from NULL to their own user_id)
DROP POLICY IF EXISTS "Users can update their own slots" ON public.account_slots;
CREATE POLICY "Users can claim or manage own slots"
ON public.account_slots
FOR UPDATE
USING (user_id IS NULL OR auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- account_usage_history: allow members to insert their own usage records
CREATE POLICY "Users can insert their own usage records"
ON public.account_usage_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage records"
ON public.account_usage_history
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);