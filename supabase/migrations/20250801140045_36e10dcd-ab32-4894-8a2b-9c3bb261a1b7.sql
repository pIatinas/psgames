-- Permitir acesso público aos jogos para usuários não autenticados
DROP POLICY IF EXISTS "Authenticated users can view games" ON public.games;

CREATE POLICY "Public can view games" 
ON public.games 
FOR SELECT 
USING (true);

-- Permitir acesso público aos account_games para usuários não autenticados  
DROP POLICY IF EXISTS "Authenticated users can view account games" ON public.account_games;

CREATE POLICY "Public can view account games" 
ON public.account_games 
FOR SELECT 
USING (true);

-- Permitir acesso público aos account_slots para usuários não autenticados
DROP POLICY IF EXISTS "Authenticated users can view account slots" ON public.account_slots;

CREATE POLICY "Public can view account slots" 
ON public.account_slots 
FOR SELECT 
USING (true);

-- Permitir acesso público limitado aos accounts (apenas para visualização de slots)
CREATE POLICY "Public can view basic account info" 
ON public.accounts 
FOR SELECT 
USING (true);

-- Permitir acesso público limitado aos profiles ativos
DROP POLICY IF EXISTS "Authenticated users can view active profiles" ON public.profiles;

CREATE POLICY "Public can view active profiles" 
ON public.profiles 
FOR SELECT 
USING (active = true);