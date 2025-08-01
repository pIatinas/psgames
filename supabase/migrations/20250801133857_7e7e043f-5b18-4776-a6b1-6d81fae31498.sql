-- Restrict games access to authenticated users only
DROP POLICY IF EXISTS "Anyone can view games" ON public.games;

CREATE POLICY "Authenticated users can view games" 
ON public.games 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Fix remaining function search paths
ALTER FUNCTION public.hash_password(text) SET search_path = 'public';
ALTER FUNCTION public.verify_password(text, text) SET search_path = 'public';