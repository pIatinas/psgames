
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
    let userCache: { [key: string]: User | null } = {};

    const loadUserProfile = async (userId: string): Promise<User | null> => {
      // Use cache to avoid repeated API calls
      if (userCache[userId]) {
        return userCache[userId];
      }
      
      const user = await fetchUserProfile(userId);
      userCache[userId] = user;
      return user;
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          const user = await loadUserProfile(currentSession.user.id);
          if (user && !user.active) {
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
        setIsLoading(false);
      }
    );

    // Initialize auth - only run once
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (initialSession?.user) {
          setSession(initialSession);
          const user = await loadUserProfile(initialSession.user.id);
          
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
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
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
