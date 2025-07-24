
-- Criar tabela para vincular jogos às contas
CREATE TABLE IF NOT EXISTS public.account_games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(account_id, game_id)
);

-- Habilitar RLS na tabela account_games
ALTER TABLE public.account_games ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para account_games
CREATE POLICY "Anyone can view account games" 
  ON public.account_games 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage account games" 
  ON public.account_games 
  FOR ALL 
  USING (is_current_user_admin());

-- Criar tabela para slots de contas (se não existir)
CREATE TABLE IF NOT EXISTS public.account_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  slot_number INTEGER NOT NULL CHECK (slot_number IN (1, 2)),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(account_id, slot_number)
);

-- Habilitar RLS na tabela account_slots
ALTER TABLE public.account_slots ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para account_slots
CREATE POLICY "Anyone can view account slots" 
  ON public.account_slots 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own slots" 
  ON public.account_slots 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage account slots" 
  ON public.account_slots 
  FOR ALL 
  USING (is_current_user_admin());

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger nas tabelas se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_account_games_updated_at') THEN
        CREATE TRIGGER update_account_games_updated_at
            BEFORE UPDATE ON public.account_games
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
