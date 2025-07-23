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

  async create(game: Omit<Game, 'id' | 'created_at' | 'updated_at'>): Promise<Game | null> {
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
    
    return {
      ...data,
      platform: data.platform as GamePlatform[]
    };
  },

  async update(id: string, game: Partial<Game>): Promise<Game | null> {
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
        slot_number: slot.slot_number as 1 | 2
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
        slot_number: slot.slot_number as 1 | 2
      }))
    };
  },

  async create(account: Omit<Account, 'id' | 'created_at' | 'updated_at' | 'games' | 'slots'>): Promise<Account | null> {
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
    
    return { ...data, games: [], slots: [] };
  },

  async update(id: string, account: Partial<Account>): Promise<Account | null> {
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
      .from('profiles')
      .select(`
        *,
        user_roles(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    
    return (data || []).map(profile => {
      const roles = profile.user_roles || [];
      const hasAdminRole = roles.some((role: any) => role.role === 'admin');
      const userRole = hasAdminRole ? 'admin' : 'member';
      
      return {
        id: profile.id,
        name: profile.name || 'User',
        email: '', // Email not available in profiles table
        role: userRole,
        profile: {
          id: profile.id,
          name: profile.name,
          avatar_url: profile.avatar_url,
          role: userRole,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        },
        roles: roles
      };
    });
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
