-- Fix database function search path settings for security
ALTER FUNCTION public.handle_admin_user() SET search_path = 'public';
ALTER FUNCTION public.handle_new_user() SET search_path = 'public', 'auth';