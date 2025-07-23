
-- Verificar e corrigir a estrutura das tabelas para suportar os vínculos
-- Adicionar constraint para validar slot_number
ALTER TABLE public.account_slots 
ADD CONSTRAINT check_slot_number CHECK (slot_number IN (1, 2));

-- Verificar se existem dados inválidos e corrigi-los
UPDATE public.account_slots 
SET slot_number = 1 
WHERE slot_number NOT IN (1, 2);

-- Criar função para listar todos os usuários (incluindo admins)
CREATE OR REPLACE FUNCTION public.get_all_users_with_profiles()
RETURNS TABLE (
  id uuid,
  email text,
  name text,
  avatar_url text,
  role text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    p.id,
    au.email,
    p.name,
    p.avatar_url,
    p.role,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  JOIN auth.users au ON p.id = au.id
  ORDER BY p.created_at DESC;
$$;

-- Atualizar políticas para permitir que admins vejam todos os usuários
DROP POLICY IF EXISTS "Anyone can view profiles for listing" ON public.profiles;
CREATE POLICY "Anyone can view profiles for listing" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Política para permitir que usuários autenticados criem perfis
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);
