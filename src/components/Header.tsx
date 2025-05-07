
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogIn, Search } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-primary/20">
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
            <span className="text-xl font-bold text-gradient">PS5 Account Hub</span>
          </Link>
          
          <nav className="hidden md:flex items-center ml-6 space-x-4">
            <Link to="/games" className="text-sm font-medium hover:text-primary transition-colors">
              Jogos
            </Link>
            <Link to="/accounts" className="text-sm font-medium hover:text-primary transition-colors">
              Contas
            </Link>
            <Link to="/members" className="text-sm font-medium hover:text-primary transition-colors">
              Membros
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative text-foreground/60 hover:text-primary">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="outline" className="hidden md:flex border-primary/50 hover:border-primary hover:bg-primary/20" asChild>
            <Link to="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Entrar
            </Link>
          </Button>
          
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link to="/register">
              <User className="mr-2 h-4 w-4" />
              Cadastrar
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
