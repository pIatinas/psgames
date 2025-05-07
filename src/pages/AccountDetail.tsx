
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
import { accounts } from '@/data/mockData';
import AccountNotFound from '@/components/account/AccountNotFound';
import AccountDetailsCard from '@/components/account/AccountDetailsCard';
import AccountGamesList from '@/components/account/AccountGamesList';
import AccountSidebar from '@/components/account/AccountSidebar';

const AccountDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Simular um usuário logado (membro #1)
  const currentMemberId = "1";
  const [isLoggedIn] = React.useState(false);
  
  // Encontrar a conta pelo ID
  const account = accounts.find(account => account.id === id);
  
  // Se a conta não for encontrada
  if (!account) {
    return <AccountNotFound />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <div className="container py-8">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              className="mr-4 text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link to="/accounts">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
            <SectionTitle 
              title={account.name} 
              className="mb-0"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Informações da conta */}
              <AccountDetailsCard account={account} />
              
              {/* Jogos da conta */}
              <AccountGamesList games={account.games} />
            </div>
            
            {/* Barra lateral */}
            <div>
              <AccountSidebar 
                account={account}
                currentMemberId={currentMemberId}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountDetail;
