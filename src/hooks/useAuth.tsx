
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (emailOrPsn: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser?: (updatedUser: User) => void;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  session: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        if (currentSession?.user) {
          fetchUserProfile(currentSession.user.id);
        } else {
          setCurrentUser(null);
        }
      }
    );

    // Check for initial session
    const initializeAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      
      if (initialSession?.user) {
        fetchUserProfile(initialSession.user.id);
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // First check for admin role in profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;

      // Then get member data
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (memberError && memberError.code !== 'PGRST116') throw memberError;

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

      setCurrentUser(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setCurrentUser(null);
    }
  };

  const updateCurrentUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    
    // Update the member record in Supabase if member data exists
    if (updatedUser.member && session?.user) {
      supabase
        .from('members')
        .update({
          name: updatedUser.name,
          email: updatedUser.email,
          psn_id: updatedUser.member.psn_id,
          profile_image: updatedUser.member.profile_image
        })
        .eq('user_id', session.user.id)
        .then(({ error }) => {
          if (error) {
            console.error('Failed to update profile:', error);
            toast({
              title: "Erro ao atualizar perfil",
              description: "Não foi possível salvar suas alterações.",
              variant: "destructive",
            });
          }
        });
    }
  };

  const login = async (emailOrPsn: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // First try to login with email and password through Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailOrPsn, // Assume it's an email first
        password: password
      });

      if (error) {
        // If direct login fails, check if it's a PSN ID instead
        const { data: members, error: memberError } = await supabase
          .from('members')
          .select('user_id, email')
          .eq('psn_id', emailOrPsn)
          .single();

        if (memberError || !members) {
          toast({
            title: "Erro de login",
            description: "Credenciais inválidas.",
            variant: "destructive",
          });
          setIsLoading(false);
          return false;
        }

        // If we found a member by PSN ID, try to login with their email
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: members.email,
          password: password
        });

        if (authError) {
          toast({
            title: "Erro de login",
            description: "Senha incorreta.",
            variant: "destructive",
          });
          setIsLoading(false);
          return false;
        }

        // Special case for admin login
        if (emailOrPsn === 'wallace_erick@hotmail.com') {
          await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', authData.user.id);
        }

        setSession(authData.session);
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!",
        });
        
        return true;
      }

      // If login was successful
      setSession(data.session);
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta!",
      });
      
      // Special case for admin login
      if (emailOrPsn === 'wallace_erick@hotmail.com' && data.user) {
        await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', data.user.id);
      }

      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erro de login",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout error:", error);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível encerrar sua sessão.",
        variant: "destructive",
      });
    } else {
      setCurrentUser(null);
      setSession(null);
      toast({
        title: "Logout bem-sucedido",
        description: "Você foi desconectado com sucesso.",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isLoading, 
      login, 
      logout, 
      updateCurrentUser,
      session 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
