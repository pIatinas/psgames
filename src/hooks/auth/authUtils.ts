
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Define types for Supabase database tables
interface ProfileData {
  id: string;
  name?: string;
  avatar_url?: string;
  role?: string;
  created_at: string;
  updated_at: string;
}

// Fetch user profile from Supabase
export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    // Get profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Error fetching profile:", profileError);
      return null;
    }

    // Determine the role with proper type checking
    let userRole: 'member' | 'admin' = 'member'; // Default role
    
    if (profileData && profileData.role) {
      // Ensure role is one of the valid types
      userRole = profileData.role === 'admin' ? 'admin' : 'member';
    }

    // Construct user object with null checks
    const user: User = {
      id: userId,
      name: profileData?.name || 'User',
      email: '', // Will be populated from auth if needed
      role: userRole,
      profile: profileData as ProfileData
    };

    return user;
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    return null;
  }
};

// Update user profile in Supabase
export const updateUserProfile = async (user: User, sessionUserId: string): Promise<boolean> => {
  try {
    if (!sessionUserId) {
      return false;
    }
    
    const updateData = {
      name: user.name,
      avatar_url: user.profile?.avatar_url
    };
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', sessionUserId);

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
    const roleData = { role: 'admin' as const };
    
    const { error } = await supabase
      .from('profiles')
      .update(roleData)
      .eq('id', userId);
      
    if (error) {
      console.error("Error setting user as admin:", error);
    }
  } catch (error) {
    console.error("Error setting user as admin:", error);
  }
};
