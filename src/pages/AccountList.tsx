
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountCard from '@/components/AccountCard';
import SectionTitle from '@/components/SectionTitle';
import { accounts } from '@/data/mockData';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const AccountList = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredAccounts = accounts.filter(account => {
    return account.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container py-8">
        <SectionTitle 
          title="Contas Disponíveis" 
          subtitle="Explore nossa coleção de contas com diversos jogos"
        />
        
        {/* Filtros */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar por email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Grid de contas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredAccounts.map(account => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
        
        {/* Mensagem quando não há contas */}
        {filteredAccounts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Nenhuma conta encontrada com os filtros atuais.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AccountList;

