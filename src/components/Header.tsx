
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogIn, Search, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser) return '';
    return currentUser.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1 rounded-full bg-primary/20">
              <svg 
                className="h-6 w-6 text-primary" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm-.5 5v6H5v2h6.5v6h1v-6H19v-2h-6.5V5h-1z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">PSGames</span>
          </Link>
          
          <nav className="hidden md:flex items-center ml-6 space-x-4">
            <Link to="/games" className="text-sm font-medium text-white hover:text-primary transition-colors">
              Jogos
            </Link>
            <Link to="/accounts" className="text-sm font-medium text-white hover:text-primary transition-colors">
              Contas
            </Link>
            <Link to="/members" className="text-sm font-medium text-white hover:text-primary transition-colors">
              Membros
            </Link>
            {currentUser && currentUser.role === 'admin' && (
              <Link to="/admin" className="text-sm font-medium text-white transition-colors flex items-center">
                <Settings className="h-4 w-4 mr-1" />
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative text-white hover:text-primary">
            <Search className="h-5 w-5" />
          </Button>
          
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 flex items-center text-white">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={currentUser.member?.profile_image} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="max-w-24 truncate">{currentUser.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile">Meu Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-accounts">Minhas Contas</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" className="hidden md:flex text-white" asChild>
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </Link>
              </Button>
              
              <Button asChild>
                <Link to="/register">
                  <User className="mr-2 h-4 w-4" />
                  Cadastrar
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
