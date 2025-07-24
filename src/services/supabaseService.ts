import { supabase } from '@/integrations/supabase/client';
import { User, Account, Game, UserRole, GamePlatform } from '@/types';

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
  },

  async linkToAccounts(gameId: string, accountIds: string[]): Promise<boolean> {
    // Remove existing links
    await supabase
      .from('account_games')
      .delete()
      .eq('game_id', gameId);
    
    // Add new links
    if (accountIds.length > 0) {
      const { error } = await supabase
        .from('account_games')
        .insert(accountIds.map(accountId => ({
          game_id: gameId,
          account_id: accountId
        })));
      
      if (error) {
        console.error('Error linking game to accounts:', error);
        return false;
      }
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
    
    // Get all user profiles to match with slots
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, active');
    
    return (data || []).map(account => ({
      ...account,
      games: account.account_games?.map((ag: any) => ({
        ...ag.games,
        platform: ag.games.platform as GamePlatform[]
      })) || [],
      slots: (account.account_slots || []).map((slot: any) => {
        const userProfile = profiles?.find(p => p.id === slot.user_id);
        return {
          ...slot,
          slot_number: (slot.slot_number === 1 || slot.slot_number === 2) ? slot.slot_number : 1,
          user: userProfile ? {
            id: userProfile.id,
            name: userProfile.name || 'Usuário',
            active: userProfile.active
          } : undefined
        };
      })
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
    
    // Get all user profiles to match with slots
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, active');
    
    return {
      ...data,
      games: data.account_games?.map((ag: any) => ({
        ...ag.games,
        platform: ag.games.platform as GamePlatform[]
      })) || [],
      slots: (data.account_slots || []).map((slot: any) => {
        const userProfile = profiles?.find(p => p.id === slot.user_id);
        return {
          ...slot,
          slot_number: (slot.slot_number === 1 || slot.slot_number === 2) ? slot.slot_number : 1,
          user: userProfile ? {
            id: userProfile.id,
            name: userProfile.name || 'Usuário',
            active: userProfile.active
          } : undefined
        };
      })
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

  async linkToGames(accountId: string, gameIds: string[]): Promise<boolean> {
    // Remove existing links
    await supabase
      .from('account_games')
      .delete()
      .eq('account_id', accountId);
    
    // Add new links
    if (gameIds.length > 0) {
      const { error } = await supabase
        .from('account_games')
        .insert(gameIds.map(gameId => ({
          account_id: accountId,
          game_id: gameId
        })));
      
      if (error) {
        console.error('Error linking account to games:', error);
        return false;
      }
    }
    
    return true;
  },

  async assignSlot(accountId: string, slotNumber: 1 | 2, userId: string): Promise<boolean> {
    // Check if slot is already occupied
    const { data: existingSlot } = await supabase
      .from('account_slots')
      .select('*')
      .eq('account_id', accountId)
      .eq('slot_number', slotNumber)
      .maybeSingle();
    
    if (existingSlot) {
      // Update existing slot
      const { error } = await supabase
        .from('account_slots')
        .update({ user_id: userId, entered_at: new Date().toISOString() })
        .eq('id', existingSlot.id);
      
      if (error) {
        console.error('Error updating slot:', error);
        return false;
      }
    } else {
      // Create new slot
      const { error } = await supabase
        .from('account_slots')
        .insert({
          account_id: accountId,
          slot_number: slotNumber,
          user_id: userId
        });
      
      if (error) {
        console.error('Error creating slot:', error);
        return false;
      }
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
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      if (!profiles) return [];

      return profiles.map(profile => ({
        id: profile.id,
        name: profile.name || 'User',
        email: '',
        role: (profile.role as UserRole) || 'member',
        active: profile.active || false,
        profile: {
          id: profile.id,
          name: profile.name,
          avatar_url: profile.avatar_url,
          role: (profile.role as UserRole) || 'member',
          active: profile.active || false,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        }
      }));
    } catch (error) {
      console.error('Error in getAll:', error);
      return [];
    }
  },

  async getById(id: string): Promise<User | null> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !profile) {
        console.error('Error fetching user:', error);
        return null;
      }

      return {
        id: profile.id,
        name: profile.name || 'User',
        email: '',
        role: (profile.role as UserRole) || 'member',
        active: profile.active || false,
        profile: {
          id: profile.id,
          name: profile.name,
          avatar_url: profile.avatar_url,
          role: (profile.role as UserRole) || 'member',
          active: profile.active || false,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        }
      };
    } catch (error) {
      console.error('Error in getById:', error);
      return null;
    }
  },

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'member';
    active?: boolean;
  }): Promise<{ user: any; error: any }> {
    try {
      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name: userData.name
        }
      });

      if (error) {
        return { user: null, error };
      }

      // Update the profile with additional data
      if (data.user) {
        await supabase
          .from('profiles')
          .update({
            name: userData.name,
            role: userData.role,
            active: userData.active || false
          })
          .eq('id', data.user.id);
      }

      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  },

  async updateProfile(userId: string, updates: { name?: string; role?: UserRole; active?: boolean }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return false;
    }
  },

  async toggleUserActive(userId: string, active: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ active })
        .eq('id', userId);

      if (error) {
        console.error('Error toggling user active status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in toggleUserActive:', error);
      return false;
    }
  },

  async createProfile(userId: string, profileData: any): Promise<any> {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        name: profileData.name,
        avatar_url: profileData.avatar_url,
        role: profileData.role || 'member',
        active: profileData.active || false
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
    
    return data;
  },

  async linkToAccounts(userId: string, accountSlots: Array<{ accountId: string, slotNumber: 1 | 2 }>): Promise<boolean> {
    // Remove existing slots for this user
    await supabase
      .from('account_slots')
      .delete()
      .eq('user_id', userId);
    
    // Add new slots
    for (const slot of accountSlots) {
      const success = await accountService.assignSlot(slot.accountId, slot.slotNumber, userId);
      if (!success) {
        console.error('Error assigning slot:', slot);
        return false;
      }
    }
    
    return true;
  }
};
