import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, Gamepad2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Breadcrumbs from '@/components/Breadcrumbs';
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
          
          <nav className="flex-1 flex justify-center">
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-muted-foreground hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/games" className="text-muted-foreground hover:text-white transition-colors">
                Jogos
              </Link>
              <Link to="/accounts" className="text-muted-foreground hover:text-white transition-colors">
                Contas
              </Link>
              <Link to="/members" className="text-muted-foreground hover:text-white transition-colors">
                Membros
              </Link>
            </div>
          </nav>
          
          <div className="flex items-center space-x-2">
            
            {currentUser ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="font-bold text-slate-50 bg-gray-950 hover:bg-gray-800">
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
                  {currentUser.role === 'admin' && <DropdownMenuItem asChild>
                      <Link to="/admin/games" className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Gerenciar
                      </Link>
                    </DropdownMenuItem>}
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <>
                <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                  <Link to="/login" className="hover:text-primary ">Entrar</Link>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link to="/register">Cadastro</Link>
                </Button>
              </>}
          </div>
        </div>
      </div>
    </header>;
};
export default Header;