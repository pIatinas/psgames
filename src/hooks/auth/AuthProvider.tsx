
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { AuthContextType } from './authTypes';
import { fetchUserProfile } from './authUtils';
import { clearAuthCache, validateSession } from './authCache';

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
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  
  // Use refs to prevent multiple simultaneous operations
  const isLoadingProfile = useRef(false);
  const lastProfileFetch = useRef<string | null>(null);
  const mounted = useRef(true);

  const loadUserProfile = async (userId: string, showToasts = true) => {
    // Prevent duplicate profile fetches for the same user
    if (isLoadingProfile.current || lastProfileFetch.current === userId) {
      return;
    }

    isLoadingProfile.current = true;
    lastProfileFetch.current = userId;

    try {
      console.log(`Loading profile for user: ${userId}`);
      const user = await fetchUserProfile(userId);
      
      if (user) {
        if (!user.active) {
          console.log('User is inactive, signing out');
          await supabase.auth.signOut();
          if (showToasts) {
            toast({
              title: "Conta inativa",
              description: "Sua conta não está ativa. Entre em contato com o administrador.",
              variant: "destructive",
            });
          }
          setCurrentUser(null);
          setSession(null);
        } else {
          console.log('User profile loaded successfully:', user.name);
          setCurrentUser(user);
        }
      } else {
        console.log('Failed to load user profile, signing out');
        await supabase.auth.signOut();
        setCurrentUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      await supabase.auth.signOut();
      setCurrentUser(null);
      setSession(null);
    } finally {
      isLoadingProfile.current = false;
    }
  };

  const clearAuthState = () => {
    console.log('Clearing auth state');
    setCurrentUser(null);
    setSession(null);
    lastProfileFetch.current = null;
    isLoadingProfile.current = false;
  };

  useEffect(() => {
    mounted.current = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Validate current session first
        const isSessionValid = await validateSession();
        
        if (!mounted.current) return;
        
        if (!isSessionValid) {
          console.log('Invalid session detected, clearing state');
          clearAuthState();
          setIsLoading(false);
          setIsInitialized(true);
          return;
        }
        
        // Get session after validation
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (!mounted.current) return;

        if (error) {
          console.error('Session error during initialization:', error);
          await clearAuthCache();
          clearAuthState();
          setIsLoading(false);
          setIsInitialized(true);
          return;
        }

        setSession(initialSession);

        if (initialSession?.user) {
          console.log('Initial session found, loading profile...');
          await loadUserProfile(initialSession.user.id, false);
        } else {
          console.log('No initial session found');
        }

        setIsLoading(false);
        setIsInitialized(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted.current) {
          await clearAuthCache();
          clearAuthState();
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted.current || !isInitialized) return;
        
        console.log(`Auth state change: ${event}`);
        
        // Handle different events
        switch (event) {
          case 'SIGNED_IN':
            if (currentSession?.user && currentSession.user.id !== lastProfileFetch.current) {
              setSession(currentSession);
              await loadUserProfile(currentSession.user.id);
            }
            break;
            
          case 'SIGNED_OUT':
            clearAuthState();
            break;
            
          case 'TOKEN_REFRESHED':
            if (currentSession?.user) {
              setSession(currentSession);
              // Don't reload profile on token refresh if user is the same
              if (!currentUser || currentUser.id !== currentSession.user.id) {
                await loadUserProfile(currentSession.user.id, false);
              }
            }
            break;
            
          case 'USER_UPDATED':
            if (currentSession?.user) {
              setSession(currentSession);
              await loadUserProfile(currentSession.user.id, false);
            }
            break;
            
          default:
            if (!currentSession) {
              clearAuthState();
            }
        }
      }
    );

    // Initialize auth after setting up the listener
    initializeAuth();

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const updateCurrentUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const login = async (emailOrPsn: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailOrPsn,
        password: password
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Erro de login",
          description: "Credenciais inválidas.",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        console.log('Login successful');
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!",
        });
        // Auth state change will handle loading the profile
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erro de login",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast({
          title: "Erro ao sair",
          description: "Não foi possível encerrar sua sessão.",
          variant: "destructive",
        });
      } else {
        clearAuthState();
        toast({
          title: "Logout bem-sucedido",
          description: "Você foi desconectado com sucesso.",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      clearAuthState();
    }
  };

  const contextValue: AuthContextType = {
    currentUser,
    isLoading,
    login,
    logout,
    updateCurrentUser,
    session
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
