
import { supabase } from '@/integrations/supabase/client';
import { Game, Account, User, GamePlatform } from '@/types';

// Game service
export const gameService = {
  async getAll(): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching games:', error);
      return [];
    }
    
    return (data || []).map(game => ({
      ...game,
      platform: (game.platform as GamePlatform[]) || [],
      description: game.description || '',
      developer: game.developer || '',
      genre: game.genre || '',
      release_date: game.release_date || ''
    }));
  },

  async getById(id: string): Promise<Game | null> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching game:', error);
      return null;
    }
    
    return {
      ...data,
      platform: data.platform as GamePlatform[]
    };
  },

  async create(game: Omit<Game, 'id' | 'created_at' | 'updated_at'>, accountIds: string[] = []): Promise<Game | null> {
    const { data, error } = await supabase
      .from('games')
      .insert({
        name: game.name,
        image: game.image,
        banner: game.banner,
        platform: game.platform,
        description: game.description || '',
        developer: game.developer || '',
        genre: game.genre || '',
        release_date: game.release_date || '',
        rawg_id: game.rawg_id
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating game:', error);
      return null;
    }

    // Vincular jogo às contas selecionadas
    if (accountIds.length > 0) {
      const accountGameLinks = accountIds.map(accountId => ({
        game_id: data.id,
        account_id: accountId
      }));

      const { error: linkError } = await supabase
        .from('account_games')
        .insert(accountGameLinks);

      if (linkError) {
        console.error('Error linking game to accounts:', linkError);
      }
    }
    
    return {
      ...data,
      platform: data.platform as GamePlatform[]
    };
  },

  async update(id: string, game: Partial<Game>, accountIds: string[] = []): Promise<Game | null> {
    const { data, error } = await supabase
      .from('games')
      .update(game)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating game:', error);
      return null;
    }

    // Atualizar vínculos com contas
    // Primeiro remove todos os vínculos existentes
    await supabase
      .from('account_games')
      .delete()
      .eq('game_id', id);

    // Depois adiciona os novos vínculos
    if (accountIds.length > 0) {
      const accountGameLinks = accountIds.map(accountId => ({
        game_id: id,
        account_id: accountId
      }));

      const { error: linkError } = await supabase
        .from('account_games')
        .insert(accountGameLinks);

      if (linkError) {
        console.error('Error linking game to accounts:', linkError);
      }
    }
    
    return {
      ...data,
      platform: data.platform as GamePlatform[]
    };
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting game:', error);
      return false;
    }
    
    return true;
  }
};

// Account service
export const accountService = {
  async getAll(): Promise<Account[]> {
    const { data, error } = await supabase
      .from('accounts')
      .select(`
        *,
        account_games(
          games(*)
        ),
        account_slots(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching accounts:', error);
      return [];
    }
    
    return (data || []).map(account => ({
      ...account,
      games: account.account_games?.map((ag: any) => ({
        ...ag.games,
        platform: ag.games.platform as GamePlatform[]
      })) || [],
      slots: (account.account_slots || []).map((slot: any) => ({
        ...slot,
        slot_number: (slot.slot_number === 1 || slot.slot_number === 2) ? slot.slot_number : 1
      }))
    }));
  },

  async getById(id: string): Promise<Account | null> {
    const { data, error } = await supabase
      .from('accounts')
      .select(`
        *,
        account_games(
          games(*)
        ),
        account_slots(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching account:', error);
      return null;
    }
    
    return {
      ...data,
      games: data.account_games?.map((ag: any) => ({
        ...ag.games,
        platform: ag.games.platform as GamePlatform[]
      })) || [],
      slots: (data.account_slots || []).map((slot: any) => ({
        ...slot,
        slot_number: (slot.slot_number === 1 || slot.slot_number === 2) ? slot.slot_number : 1
      }))
    };
  },

  async create(account: Omit<Account, 'id' | 'created_at' | 'updated_at' | 'games' | 'slots'>, gameIds: string[] = []): Promise<Account | null> {
    const { data, error } = await supabase
      .from('accounts')
      .insert({
        email: account.email,
        password: account.password,
        birthday: account.birthday,
        security_answer: account.security_answer,
        codes: account.codes,
        qr_code: account.qr_code
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating account:', error);
      return null;
    }

    // Vincular conta aos jogos selecionados
    if (gameIds.length > 0) {
      const accountGameLinks = gameIds.map(gameId => ({
        account_id: data.id,
        game_id: gameId
      }));

      const { error: linkError } = await supabase
        .from('account_games')
        .insert(accountGameLinks);

      if (linkError) {
        console.error('Error linking account to games:', linkError);
      }
    }
    
    return { ...data, games: [], slots: [] };
  },

  async update(id: string, account: Partial<Account>, gameIds: string[] = []): Promise<Account | null> {
    const { data, error } = await supabase
      .from('accounts')
      .update(account)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating account:', error);
      return null;
    }

    // Atualizar vínculos com jogos
    // Primeiro remove todos os vínculos existentes
    await supabase
      .from('account_games')
      .delete()
      .eq('account_id', id);

    // Depois adiciona os novos vínculos
    if (gameIds.length > 0) {
      const accountGameLinks = gameIds.map(gameId => ({
        account_id: id,
        game_id: gameId
      }));

      const { error: linkError } = await supabase
        .from('account_games')
        .insert(accountGameLinks);

      if (linkError) {
        console.error('Error linking account to games:', linkError);
      }
    }
    
    return { ...data, games: [], slots: [] };
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting account:', error);
      return false;
    }
    
    return true;
  },

  async freeSlot(accountId: string, slotNumber: number): Promise<boolean> {
    const { error } = await supabase
      .from('account_slots')
      .delete()
      .eq('account_id', accountId)
      .eq('slot_number', slotNumber);
    
    if (error) {
      console.error('Error freeing slot:', error);
      return false;
    }
    
    return true;
  }
};

// User service
export const userService = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .rpc('get_all_users_with_profiles');
    
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    
    return (data || []).map((user: any) => ({
      id: user.id,
      name: user.name || 'User',
      email: user.email || '',
      role: user.role === 'admin' ? 'admin' : 'member',
      profile: {
        id: user.id,
        name: user.name,
        avatar_url: user.avatar_url,
        role: user.role === 'admin' ? 'admin' : 'member',
        created_at: user.created_at,
        updated_at: user.updated_at
      },
      roles: []
    }));
  },

  async createUser(userData: { name: string; email: string; password: string; avatar_url?: string }, accountIds: string[] = []): Promise<User | null> {
    // Criar usuário na auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          avatar_url: userData.avatar_url
        }
      }
    });

    if (authError) {
      console.error('Error creating user:', authError);
      return null;
    }

    if (!authData.user) {
      console.error('User creation failed: no user returned');
      return null;
    }

    // Vincular usuário às contas selecionadas
    if (accountIds.length > 0) {
      const userAccountLinks = accountIds.map(accountId => ({
        user_id: authData.user!.id,
        account_id: accountId
      }));

      const { error: linkError } = await supabase
        .from('user_accounts')
        .insert(userAccountLinks);

      if (linkError) {
        console.error('Error linking user to accounts:', linkError);
      }
    }

    return {
      id: authData.user.id,
      name: userData.name,
      email: userData.email,
      role: 'member',
      profile: {
        id: authData.user.id,
        name: userData.name,
        avatar_url: userData.avatar_url,
        role: 'member',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      roles: []
    };
  },

  async updateProfile(userId: string, profileData: any): Promise<any> {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    return data;
  }
};
