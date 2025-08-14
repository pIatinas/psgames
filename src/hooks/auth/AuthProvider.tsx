
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
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;
        
        setSession(currentSession);
        setIsLoading(true);
        
        if (currentSession?.user) {
          try {
            const user = await fetchUserProfile(currentSession.user.id);
            if (user && !user.active) {
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
            }
          } catch (error) {
            console.error('Error loading user profile:', error);
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
        setIsLoading(false);
      }
    );

    // Initialize auth - only run once
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        // If there's an error getting the session (invalid token), clear everything
        if (error) {
          console.error('Session error, clearing auth:', error);
          await supabase.auth.signOut();
          setCurrentUser(null);
          setSession(null);
          setIsLoading(false);
          return;
        }
        
        setSession(initialSession);
        
        if (initialSession?.user) {
          try {
            const user = await fetchUserProfile(initialSession.user.id);
            
            if (user && !user.active) {
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
            }
          } catch (profileError) {
            console.error('Error fetching user profile, clearing auth:', profileError);
            // If we can't fetch the profile (invalid token/user), clear auth
            await supabase.auth.signOut();
            setCurrentUser(null);
            setSession(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error, clearing auth:', error);
        // Clear any corrupted auth state
        await supabase.auth.signOut();
        setCurrentUser(null);
        setSession(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  const updateCurrentUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const login = async (emailOrPsn: string, password: string): Promise<boolean> => {
    try {
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

      // Don't check user profile here - let onAuthStateChange handle it
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta!",
      });
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erro de login",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
      return false;
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
