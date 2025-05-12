
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
  user_id: string;
}

// Fetch user profile from Supabase
export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    // First check for role in profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles' as never)
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Error fetching profile:", profileError);
      return null;
    }

    // Then get member data
    const { data: memberData, error: memberError } = await supabase
      .from('members' as never)
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (memberError && memberError.code !== 'PGRST116') {
      console.error("Error fetching member:", memberError);
      return null;
    }

    // Construct user object with null checks
    const user: User = {
      id: userId,
      name: memberData?.name || 'User',
      email: memberData?.email || '',
      role: (profileData && profileData.role) ? profileData.role : 'member'
    };

    // Add member data if available
    if (memberData) {
      const typedMemberData = memberData as unknown as MemberData;
      user.member = {
        id: typedMemberData.id,
        name: typedMemberData.name,
        email: typedMemberData.email,
        psn_id: typedMemberData.psn_id,
        password: '', // Secure placeholder as we don't store or display passwords
        profile_image: typedMemberData.profile_image || '',
        created_at: new Date(typedMemberData.created_at),
        isApproved: typedMemberData.is_approved,
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
    
    const updateData = {
      name: user.name,
      email: user.email,
      psn_id: user.member.psn_id,
      profile_image: user.member.profile_image
    };
    
    const { error } = await supabase
      .from('members' as never)
      .update(updateData as never)
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
    const roleData = { role: 'admin' };
    
    const { error } = await supabase
      .from('profiles' as never)
      .update(roleData as never)
      .eq('id', userId);
      
    if (error) {
      console.error("Error setting user as admin:", error);
    }
  } catch (error) {
    console.error("Error setting user as admin:", error);
  }
};
