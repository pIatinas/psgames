import { supabase } from '@/integrations/supabase/client';

export interface AccountUsageHistory {
  id: string;
  account_id: string;
  user_id: string;
  slot_number: number;
  activated_at: string;
  deactivated_at?: string;
  created_at: string;
}

export const accountUsageService = {
  async createUsageRecord(data: {
    account_id: string;
    user_id: string;
    slot_number: number;
  }): Promise<AccountUsageHistory | null> {
    const { data: result, error } = await supabase
      .from('account_usage_history')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async endUsageRecord(accountId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('account_usage_history')
      .update({ deactivated_at: new Date().toISOString() })
      .eq('account_id', accountId)
      .eq('user_id', userId)
      .is('deactivated_at', null);

    return !error;
  },

  async getByMember(memberId: string): Promise<AccountUsageHistory[]> {
    const { data, error } = await supabase
      .from('account_usage_history')
      .select(`
        *,
        accounts (
          id,
          email,
          games:account_games (
            games (*)
          )
        )
      `)
      .eq('user_id', memberId)
      .order('activated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByAccount(accountId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('account_usage_history')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar_url
        )
      `)
      .eq('account_id', accountId)
      .order('activated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};