
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountCard from '@/components/AccountCard';
import SectionTitle from '@/components/SectionTitle';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { accountService } from '@/services/supabaseService';
import { useQuery } from '@tanstack/react-query';
import { GamePlatform } from '@/types';

const AccountList = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<GamePlatform[]>([]);
  
  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountService.getAll(),
  });
  
  const platforms: GamePlatform[] = ["PS5", "PS4", "PS3", "VITA"];
  
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatforms.length === 0 || 
                           account.games?.some(game => 
                             selectedPlatforms.some(platform => game.platform.includes(platform))
                           );
    return matchesSearch && matchesPlatform;
  });

  const togglePlatform = (platform: GamePlatform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container py-8">
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Carregando contas...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container py-8">
        <SectionTitle 
          title="Contas Compartilhadas" 
          subtitle="Encontre contas com os jogos que você quer jogar"
        />
        
        {/* Filtros */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar contas..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Plataformas:</span>
            </div>
            {platforms.map(platform => (
              <Button
                key={platform}
                variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                size="sm"
                onClick={() => togglePlatform(platform)}
              >
                {platform}
              </Button>
            ))}
            {selectedPlatforms.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedPlatforms([])}
              >
                Limpar
              </Button>
            )}
          </div>
        </div>
        
        {/* Grid de contas - 4 por linha */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
