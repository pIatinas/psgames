
-- Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'member');

-- Criar tabela user_roles
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Habilitar RLS na tabela user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Criar função de segurança para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Criar função para verificar se o usuário atual é admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::app_role);
$$;

-- Política RLS para user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles" 
ON public.user_roles 
FOR ALL 
USING (public.is_current_user_admin());

-- Inserir role de admin para wallace_erick@hotmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'wallace_erick@hotmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Atualizar políticas existentes para usar o novo sistema de roles
DROP POLICY IF EXISTS "Only admins can insert games" ON public.games;
DROP POLICY IF EXISTS "Only admins can update games" ON public.games;
DROP POLICY IF EXISTS "Only admins can delete games" ON public.games;
DROP POLICY IF EXISTS "Only admins can view all accounts" ON public.accounts;
DROP POLICY IF EXISTS "Only admins can manage accounts" ON public.accounts;
DROP POLICY IF EXISTS "Only admins can update accounts" ON public.accounts;
DROP POLICY IF EXISTS "Only admins can delete accounts" ON public.accounts;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Only admins can manage account games" ON public.account_games;
DROP POLICY IF EXISTS "Only admins can manage account slots" ON public.account_slots;
DROP POLICY IF EXISTS "Only admins can manage user accounts" ON public.user_accounts;

-- Recriar políticas usando o novo sistema
CREATE POLICY "Only admins can insert games" ON public.games FOR INSERT WITH CHECK (public.is_current_user_admin());
CREATE POLICY "Only admins can update games" ON public.games FOR UPDATE USING (public.is_current_user_admin());
CREATE POLICY "Only admins can delete games" ON public.games FOR DELETE USING (public.is_current_user_admin());

CREATE POLICY "Only admins can view all accounts" ON public.accounts FOR SELECT USING (public.is_current_user_admin());
CREATE POLICY "Only admins can manage accounts" ON public.accounts FOR INSERT WITH CHECK (public.is_current_user_admin());
CREATE POLICY "Only admins can update accounts" ON public.accounts FOR UPDATE USING (public.is_current_user_admin());
CREATE POLICY "Only admins can delete accounts" ON public.accounts FOR DELETE USING (public.is_current_user_admin());

CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_current_user_admin());

CREATE POLICY "Only admins can manage account games" ON public.account_games FOR ALL USING (public.is_current_user_admin());
CREATE POLICY "Only admins can manage account slots" ON public.account_slots FOR ALL USING (public.is_current_user_admin());
CREATE POLICY "Only admins can manage user accounts" ON public.user_accounts FOR ALL USING (public.is_current_user_admin());
