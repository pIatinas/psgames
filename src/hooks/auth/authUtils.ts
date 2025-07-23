
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';
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

interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
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

    // Get user roles
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);

    if (rolesError) {
      console.error("Error fetching user roles:", rolesError);
      // Continue without roles
    }

    // Determine the primary role
    let userRole: UserRole = 'member'; // Default role
    
    if (rolesData && rolesData.length > 0) {
      // If user has admin role, use that; otherwise use member
      const hasAdminRole = rolesData.some(role => role.role === 'admin');
      userRole = hasAdminRole ? 'admin' : 'member';
    }

    // Construct user object with null checks
    const user: User = {
      id: userId,
      name: profileData?.name || 'User',
      email: '', // Will be populated from auth if needed
      role: userRole,
      profile: profileData ? {
        id: profileData.id,
        name: profileData.name,
        avatar_url: profileData.avatar_url,
        role: userRole,
        created_at: profileData.created_at,
        updated_at: profileData.updated_at
      } : undefined,
      roles: rolesData || []
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
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: 'admin' })
      .select()
      .single();
      
    if (error) {
      console.error("Error setting user as admin:", error);
    }
  } catch (error) {
    console.error("Error setting user as admin:", error);
  }
};

// Check if user is admin
export const isUserAdmin = (user: User | null): boolean => {
  return user?.role === 'admin' || false;
};
