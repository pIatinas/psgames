
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl font-bold text-gradient">404</div>
        <h1 className="text-3xl font-bold">Página Não Encontrada</h1>
        <p className="text-muted-foreground">
          A página que você está tentando acessar não existe ou foi removida.
        </p>
        <Button size="lg" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o início
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
