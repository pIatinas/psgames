
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AccountNotFound: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container py-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Conta não encontrada</h2>
        <p className="text-muted-foreground mb-6">
          Não foi possível encontrar a conta solicitada.
        </p>
        <Button asChild>
          <Link to="/accounts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para contas
          </Link>
        </Button>
      </main>
      
      <Footer />
    </div>
  );
};

export default AccountNotFound;
