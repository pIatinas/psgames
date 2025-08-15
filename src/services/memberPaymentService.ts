import { supabase } from '@/integrations/supabase/client';

export interface MemberPayment {
  id: string;
  member_id: string;
  month: number;
  year: number;
  status: 'paid' | 'pending' | 'overdue';
  amount: number;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export const memberPaymentService = {
  async getByMember(memberId: string): Promise<MemberPayment[]> {
    const { data, error } = await supabase
      .from('member_payments')
      .select('*')
      .eq('member_id', memberId)
      .order('year', { ascending: false })
      .order('month', { ascending: false });

    if (error) throw error;
    return (data || []) as MemberPayment[];
  },

  async upsertPayment(payment: Omit<MemberPayment, 'id' | 'created_at' | 'updated_at'>): Promise<MemberPayment | null> {
    const { data, error } = await supabase
      .from('member_payments')
      .upsert(payment, { 
        onConflict: 'member_id, month, year'
      })
      .select()
      .single();

    if (error) throw error;
    return data as MemberPayment;
  },

  async deletePayment(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('member_payments')
      .delete()
      .eq('id', id);

    return !error;
  }
};