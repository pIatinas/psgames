
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { AuthContextType } from './authTypes';
import { fetchUserProfile, setUserAsAdmin } from './authUtils';

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
      async (event, currentSession) => {
        setSession(currentSession);
        if (currentSession?.user) {
          // Check if user is active before setting as current user
          const user = await fetchUserProfile(currentSession.user.id);
          if (user && !user.active) {
            // User is not active, sign them out
            await supabase.auth.signOut();
            toast({
              title: "Conta inativa",
              description: "Sua conta não está ativa. Entre em contato com o administrador.",
              variant: "destructive",
            });
            setCurrentUser(null);
            return;
          }
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      }
    );

    // Check for initial session
    const initializeAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      if (initialSession?.user) {
        const user = await fetchUserProfile(initialSession.user.id);
        if (user && !user.active) {
          // User is not active, sign them out
          await supabase.auth.signOut();
          toast({
            title: "Conta inativa",
            description: "Sua conta não está ativa. Entre em contato com o administrador.",
            variant: "destructive",
          });
          setCurrentUser(null);
          setSession(null);
        } else {
          setCurrentUser(user);
          setSession(initialSession);
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const updateCurrentUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const login = async (emailOrPsn: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Try to login with email and password through Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailOrPsn,
        password: password
      });

      if (error) {
        toast({
          title: "Erro de login",
          description: "Credenciais inválidas.",
          variant: "destructive",
        });
        return false;
      }

      // Check if user is active
      if (data.user) {
        const userProfile = await fetchUserProfile(data.user.id);
        if (userProfile && !userProfile.active) {
          await supabase.auth.signOut();
          toast({
            title: "Conta inativa",
            description: "Sua conta não está ativa. Entre em contato com o administrador.",
            variant: "destructive",
          });
          return false;
        }
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
