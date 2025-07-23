
import { supabase } from '@/integrations/supabase/client';
import { Game, Account, User, Profile, AccountSlot } from '@/types';

// Games Service
export const gameService = {
  async getAll(): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Game | null> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async create(game: Omit<Game, 'id' | 'created_at' | 'updated_at'>): Promise<Game> {
    const { data, error } = await supabase
      .from('games')
      .insert({
        name: game.name,
        image: game.image,
        banner: game.banner,
        platform: game.platform,
        description: game.description,
        developer: game.developer,
        genre: game.genre,
        release_date: game.release_date,
        rawg_id: game.rawg_id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, game: Partial<Game>): Promise<Game> {
    const updateData: any = {};
    
    if (game.name !== undefined) updateData.name = game.name;
    if (game.image !== undefined) updateData.image = game.image;
    if (game.banner !== undefined) updateData.banner = game.banner;
    if (game.platform !== undefined) updateData.platform = game.platform;
    if (game.description !== undefined) updateData.description = game.description;
    if (game.developer !== undefined) updateData.developer = game.developer;
    if (game.genre !== undefined) updateData.genre = game.genre;
    if (game.release_date !== undefined) updateData.release_date = game.release_date;
    if (game.rawg_id !== undefined) updateData.rawg_id = game.rawg_id;
    
    const { data, error } = await supabase
      .from('games')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Accounts Service
export const accountService = {
  async getAll(): Promise<Account[]> {
    const { data, error } = await supabase
      .from('accounts')
      .select(`
        *,
        account_games(
          games(*)
        ),
        account_slots(
          *,
          user_id
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(account => ({
      ...account,
      games: account.account_games?.map((ag: any) => ag.games) || [],
      slots: account.account_slots || []
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
        account_slots(
          *,
          user_id
        )
      `)
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    if (!data) return null;

    return {
      ...data,
      games: data.account_games?.map((ag: any) => ag.games) || [],
      slots: data.account_slots || []
    };
  },

  async create(account: Omit<Account, 'id' | 'created_at' | 'updated_at' | 'games' | 'slots'>, gameIds: string[] = []): Promise<Account> {
    const { data: accountData, error: accountError } = await supabase
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
    
    if (accountError) throw accountError;

    // Link games to account
    if (gameIds.length > 0) {
      const gameLinks = gameIds.map(gameId => ({
        account_id: accountData.id,
        game_id: gameId
      }));

      const { error: gameError } = await supabase
        .from('account_games')
        .insert(gameLinks);
      
      if (gameError) throw gameError;
    }

    return this.getById(accountData.id) as Promise<Account>;
  },

  async update(id: string, account: Partial<Account>, gameIds?: string[]): Promise<Account> {
    const updateData: any = {};
    
    if (account.email !== undefined) updateData.email = account.email;
    if (account.password !== undefined) updateData.password = account.password;
    if (account.birthday !== undefined) updateData.birthday = account.birthday;
    if (account.security_answer !== undefined) updateData.security_answer = account.security_answer;
    if (account.codes !== undefined) updateData.codes = account.codes;
    if (account.qr_code !== undefined) updateData.qr_code = account.qr_code;
    
    const { data, error } = await supabase
      .from('accounts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;

    // Update game links if provided
    if (gameIds !== undefined) {
      // Remove existing links
      await supabase
        .from('account_games')
        .delete()
        .eq('account_id', id);

      // Add new links
      if (gameIds.length > 0) {
        const gameLinks = gameIds.map(gameId => ({
          account_id: id,
          game_id: gameId
        }));

        const { error: gameError } = await supabase
          .from('account_games')
          .insert(gameLinks);
        
        if (gameError) throw gameError;
      }
    }

    return this.getById(id) as Promise<Account>;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async occupySlot(accountId: string, slotNumber: number, userId: string): Promise<void> {
    const { error } = await supabase
      .from('account_slots')
      .upsert({
        account_id: accountId,
        slot_number: slotNumber,
        user_id: userId,
        entered_at: new Date().toISOString()
      });
    
    if (error) throw error;
  },

  async freeSlot(accountId: string, slotNumber: number): Promise<void> {
    const { error } = await supabase
      .from('account_slots')
      .delete()
      .eq('account_id', accountId)
      .eq('slot_number', slotNumber);
    
    if (error) throw error;
  }
};

// Users Service
export const userService = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_accounts(
          accounts(*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(profile => ({
      id: profile.id,
      name: profile.name || 'User',
      email: '', // Will be populated from auth.users if needed
      role: profile.role as 'admin' | 'member',
      profile,
      accounts: profile.user_accounts?.map((ua: any) => ua.accounts) || []
    }));
  },

  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_accounts(
          accounts(*)
        )
      `)
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      name: data.name || 'User',
      email: '', // Will be populated from auth.users if needed
      role: data.role as 'admin' | 'member',
      profile: data,
      accounts: data.user_accounts?.map((ua: any) => ua.accounts) || []
    };
  },

  async updateProfile(id: string, profile: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async assignAccount(userId: string, accountId: string): Promise<void> {
    const { error } = await supabase
      .from('user_accounts')
      .insert({
        user_id: userId,
        account_id: accountId
      });
    
    if (error) throw error;
  },

  async removeAccount(userId: string, accountId: string): Promise<void> {
    const { error } = await supabase
      .from('user_accounts')
      .delete()
      .eq('user_id', userId)
      .eq('account_id', accountId);
    
    if (error) throw error;
  }
};

// RAWG API Service for game data
export const rawgService = {
  async searchGame(query: string): Promise<any[]> {
    try {
      const response = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(query)}&page_size=10`);
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching from RAWG API:', error);
      return [];
    }
  },

  async getGameById(id: number): Promise<any | null> {
    try {
      const response = await fetch(`https://api.rawg.io/api/games/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching game details from RAWG API:', error);
      return null;
    }
  }
};
