
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { AuthContextType } from './authTypes';
import { fetchUserProfile, setUserAsAdmin, updateUserProfile } from './authUtils';

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
          // Defer the fetch to avoid auth deadlock
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id).then(user => {
              setCurrentUser(user);
            });
          }, 0);
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
        const user = await fetchUserProfile(initialSession.user.id);
        setCurrentUser(user);
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateCurrentUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    
    // Update the member record in Supabase if member data exists
    if (updatedUser.member && session?.user) {
      updateUserProfile(updatedUser, session.user.id);
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
        // Using type assertion to avoid TypeScript errors
        const { data: members, error: memberError } = await supabase
          .from('members')
          .select('user_id, email')
          .eq('psn_id', emailOrPsn)
          .maybeSingle();

        if (memberError || !members) {
          toast({
            title: "Erro de login",
            description: "Credenciais inválidas.",
            variant: "destructive",
          });
          return false;
        }

        // If we found a member by PSN ID, try to login with their email
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: members.email as string,  // Type assertion for TypeScript
          password: password
        });

        if (authError) {
          toast({
            title: "Erro de login",
            description: "Senha incorreta.",
            variant: "destructive",
          });
          return false;
        }

        // Special case for admin login
        if (emailOrPsn === 'wallace_erick@hotmail.com' && authData.user) {
          await setUserAsAdmin(authData.user.id);
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
        await setUserAsAdmin(data.user.id);
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
