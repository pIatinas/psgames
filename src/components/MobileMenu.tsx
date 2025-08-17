import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, Gamepad2, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const NavigationLink = ({ to, label }: { to: string; label: string }) => {
    const isActive = location.pathname === to || 
      (to === '/games' && location.pathname.startsWith('/games/')) ||
      (to === '/accounts' && location.pathname.startsWith('/accounts/')) ||
      (to === '/members' && location.pathname.startsWith('/members/'));
    
    return (
      <Link 
        to={to} 
        onClick={() => setOpen(false)}
        className={`block px-3 py-3 rounded-md text-lg transition-colors ${
          isActive 
            ? 'text-white bg-purple-900' 
            : 'text-muted-foreground hover:text-white'
        }`}
      >
        {label}
      </Link>
    );
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 bg-background">
          <SheetHeader>
            <SheetTitle className="flex items-center text-xl font-bold">
              <Gamepad2 className="h-6 w-6 mr-2" />
              PSGames
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-8 space-y-4">
            <nav className="space-y-2">
              <NavigationLink to="/" label="Home" />
              <NavigationLink to="/games" label="Jogos" />
              <NavigationLink to="/accounts" label="Contas" />
              <NavigationLink to="/members" label="Membros" />
            </nav>
            
            <div className="border-t pt-4">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Olá, {currentUser.name}
                  </div>
                  
                  <Link 
                    to="/my-profile" 
                    onClick={() => setOpen(false)}
                    className="flex items-center px-3 py-3 rounded-md text-lg hover:bg-muted"
                  >
                    <User className="h-5 w-5 mr-3" />
                    Meu Perfil
                  </Link>
                  
                  <Link 
                    to="/my-accounts" 
                    onClick={() => setOpen(false)}
                    className="flex items-center px-3 py-3 rounded-md text-lg hover:bg-muted"
                  >
                    <Gamepad2 className="h-5 w-5 mr-3" />
                    Minhas Contas
                  </Link>
                  
                  {currentUser.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      onClick={() => setOpen(false)}
                      className="flex items-center px-3 py-3 rounded-md text-lg hover:bg-muted"
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      Gerenciamento
                    </Link>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center px-3 py-3 rounded-md text-lg hover:bg-muted text-red-600 w-full text-left"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sair
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link 
                    to="/login" 
                    onClick={() => setOpen(false)}
                    className="block px-3 py-3 rounded-md text-lg hover:bg-muted"
                  >
                    Entrar
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setOpen(false)}
                    className="block px-3 py-3 rounded-md text-lg bg-secondary text-secondary-foreground"
                  >
                    Cadastro
                  </Link>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;