
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/types';
import { users as usersData, members } from '@/data/mockData';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (emailOrPsn: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user in local storage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (emailOrPsn: string, password: string): Promise<boolean> => {
    // Simulating API call with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if it's the admin user
        if (emailOrPsn === 'wallace_erick@hotmail.com') {
          // Find or create Wallace as admin
          let user: User = {
            id: 'admin-1',
            name: 'Wallace Erick',
            email: 'wallace_erick@hotmail.com',
            role: 'admin'
          };
          
          setCurrentUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          toast({
            title: "Login bem-sucedido",
            description: `Bem-vindo de volta, ${user.name}!`,
          });
          resolve(true);
          return;
        }
        
        // Find user with matching email or PSN ID
        const user = usersData.find(u => 
          u.email === emailOrPsn || 
          (u.member && u.member.psn_id === emailOrPsn)
        );
        
        // For members, check password as well
        if (user && user.role === 'member') {
          if (user.member?.password === password) {
            setCurrentUser(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            toast({
              title: "Login bem-sucedido",
              description: `Bem-vindo de volta, ${user.name}!`,
            });
            resolve(true);
          } else {
            toast({
              title: "Erro de login",
              description: "Senha incorreta",
              variant: "destructive",
            });
            resolve(false);
          }
        } else if (user && user.role === 'admin' && password === 'admin') {
          // For admin, use hardcoded password 'admin'
          setCurrentUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          toast({
            title: "Login bem-sucedido",
            description: `Bem-vindo de volta, ${user.name}!`,
          });
          resolve(true);
        } else {
          toast({
            title: "Erro de login",
            description: "Usuário não encontrado",
            variant: "destructive",
          });
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast({
      title: "Logout bem-sucedido",
      description: "Você foi desconectado com sucesso.",
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
