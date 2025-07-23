
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Header: React.FC = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-slate-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white hover:text-blue-300 transition-colors">
            PSGames
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`hover:text-white transition-colors ${
                isActive('/') ? 'text-white font-semibold' : 'text-gray-300'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/games" 
              className={`hover:text-white transition-colors ${
                isActive('/games') ? 'text-white font-semibold' : 'text-gray-300'
              }`}
            >
              Jogos
            </Link>
            <Link 
              to="/accounts" 
              className={`hover:text-white transition-colors ${
                isActive('/accounts') ? 'text-white font-semibold' : 'text-gray-300'
              }`}
            >
              Contas
            </Link>
            <Link 
              to="/members" 
              className={`hover:text-white transition-colors ${
                isActive('/members') ? 'text-white font-semibold' : 'text-gray-300'
              }`}
            >
              Membros
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 text-white hover:text-white hover:bg-slate-800">
                    <User className="h-4 w-4" />
                    <span>{currentUser.name || 'Usuário'}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem asChild>
                    <Link to="/my-profile" className="flex items-center text-white hover:text-white">
                      <User className="mr-2 h-4 w-4" />
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-accounts" className="flex items-center text-white hover:text-white">
                      <Settings className="mr-2 h-4 w-4" />
                      Minhas Contas
                    </Link>
                  </DropdownMenuItem>
                  {currentUser.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center text-white hover:text-white">
                        <Settings className="mr-2 h-4 w-4" />
                        Painel Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center text-white hover:text-white">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:text-white hover:bg-slate-800">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
