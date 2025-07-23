
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, Gamepad2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-primary text-primary-foreground py-4 shadow-md">
      <div className="container flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <Gamepad2 className="h-8 w-8" />
          GameShare
        </Link>
        
        <nav className="flex items-center space-x-6">
          <Link to="/games" className="hover:text-primary-foreground/80 transition-colors">
            Jogos
          </Link>
          <Link to="/accounts" className="hover:text-primary-foreground/80 transition-colors">
            Contas
          </Link>
          <Link to="/members" className="hover:text-primary-foreground/80 transition-colors">
            Membros
          </Link>
          
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-primary bg-primary-foreground hover:bg-primary-foreground/90">
                  <User className="h-4 w-4 mr-2" />
                  {currentUser.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
                {currentUser.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin/games" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Gerenciar
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="space-x-2">
              <Button asChild variant="outline" size="sm" className="text-primary bg-primary-foreground hover:bg-primary-foreground/90">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link to="/register">Cadastrar</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
