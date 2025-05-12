
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Define types for Supabase database tables
interface ProfileData {
  role?: string;
}

interface MemberData {
  id: string;
  name: string;
  email: string;
  psn_id: string;
  profile_image?: string;
  created_at: string;
  is_approved: boolean;
}

// Fetch user profile from Supabase
export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    // First check for role in profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Error fetching profile:", profileError);
      return null;
    }

    // Then get member data
    const { data: memberData, error: memberError } = await supabase
      .from('members')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (memberError && memberError.code !== 'PGRST116') {
      console.error("Error fetching member:", memberError);
      return null;
    }

    // Construct user object
    const user: User = {
      id: userId,
      name: memberData?.name || 'User',
      email: memberData?.email || '',
      role: profileData?.role || 'member'
    };

    // Add member data if available
    if (memberData) {
      user.member = {
        id: memberData.id,
        name: memberData.name,
        email: memberData.email,
        psn_id: memberData.psn_id,
        password: '', // Secure placeholder as we don't store or display passwords
        profile_image: memberData.profile_image || '',
        created_at: new Date(memberData.created_at),
        isApproved: memberData.is_approved,
        payments: [] // We'd fetch payments separately if needed
      };
    }

    return user;
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    return null;
  }
};

// Update user profile in Supabase
export const updateUserProfile = async (user: User, sessionUserId: string): Promise<boolean> => {
  try {
    if (!user.member || !sessionUserId) {
      return false;
    }
    
    const { error } = await supabase
      .from('members')
      .update({
        name: user.name,
        email: user.email,
        psn_id: user.member.psn_id,
        profile_image: user.member.profile_image
      })
      .eq('user_id', sessionUserId);

    if (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível salvar suas alterações.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
};

// Set user as admin
export const setUserAsAdmin = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', userId);
      
    if (error) {
      console.error("Error setting user as admin:", error);
    }
  } catch (error) {
    console.error("Error setting user as admin:", error);
  }
};
