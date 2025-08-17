import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, Gamepad2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Breadcrumbs from '@/components/Breadcrumbs';
import MobileMenu from '@/components/MobileMenu';

// Navigation link component with active state
const NavigationLink = ({ to, label }: { to: string; label: string }) => {
  const location = useLocation();
  
  // Check if current path matches or is a detail page of the section
  const isActive = location.pathname === to || 
    (to === '/games' && location.pathname.startsWith('/games/')) ||
    (to === '/accounts' && location.pathname.startsWith('/accounts/')) ||
    (to === '/members' && location.pathname.startsWith('/members/'));
  
  return (
    <Link 
      to={to} 
      className={`px-3 py-2 rounded-md transition-colors ${
        isActive 
          ? 'text-pink-600' 
          : 'text-muted-foreground hover:text-white'
      }`}
    >
      {label}
    </Link>
  );
};
const Header = () => {
  const {
    currentUser,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return <header className="text-white py-4 bg-[#00000036]">
      <div className="container">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <Gamepad2 className="h-8 w-8" />
            <span className="ms-2 font-bold">PS</span>Games
          </Link>
          
          <nav className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-6">
              <NavigationLink to="/" label="Home" />
              <NavigationLink to="/games" label="Jogos" />
              <NavigationLink to="/accounts" label="Contas" />
              <NavigationLink to="/members" label="Membros" />
            </div>
          </nav>
          
          <div className="flex items-center space-x-2">
            <MobileMenu />
            
            {currentUser ? <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="font-bold text-slate-50 hover:bg-gray-950">
                      <User className="h-4 w-4 mr-2" />
                      {currentUser.name}
                    </Button>
                  </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border border-border">
                  <style>{`
                    [data-radix-dropdown-menu-item]:hover {
                      background-color: hsl(var(--pink-600)) !important;
                    }
                  `}</style>
                  <DropdownMenuItem asChild>
                    <Link to="/my-profile" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-accounts" className="flex items-center">
                      <Gamepad2 className="h-4 w-4 mr-2" />
                      Minhas Contas
                    </Link>
                  </DropdownMenuItem>
                  {currentUser.role === 'admin' && <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Gerenciamento
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        
                      </DropdownMenuItem>
                    </>}
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div> : <div className="hidden md:flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                  <Link to="/login" className="hover:text-primary ">Entrar</Link>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link to="/register">Cadastro</Link>
                </Button>
              </div>}
          </div>
        </div>
      </div>
    </header>;
};
export default Header;