
import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

const AdminLayout: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if not admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para acessar esta área.",
        variant: "destructive",
      });
      navigate('/');
    } else if (!currentUser) {
      toast({
        title: "Login Necessário",
        description: "Faça login para acessar esta área.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [currentUser, navigate, toast]);

  // Return null if not authenticated or loading
  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6 text-pink-500">Área Administrativa</h1>
        
        <div className="mb-8">
          <div className="flex gap-2 border-b pb-4">
            <Button 
              variant="ghost" 
              className="text-white hover:text-primary"
              asChild
            >
              <Link to="/admin/games">Jogos</Link>
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:text-primary"
              asChild
            >
              <Link to="/admin/accounts">Contas</Link>
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:text-primary"
              asChild
            >
              <Link to="/admin/members">Membros</Link>
            </Button>
          </div>
        </div>
        
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
