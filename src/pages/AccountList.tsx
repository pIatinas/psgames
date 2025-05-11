
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountCard from '@/components/AccountCard';
import SectionTitle from '@/components/SectionTitle';
import { accounts } from '@/data/mockData';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';
import { Account } from '@/types';

const AccountList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>([]);
  const { currentUser } = useAuth();
  
  // Get unique games from accounts
  const allGames = accounts.flatMap(account => account.games || []);
  const uniqueGames = [...new Map(allGames.map(game => [game.id, game])).values()];
  
  // Filter accounts based on search and game filters
  const filteredAccounts = accounts.filter(account => {
    // Search by email
    const matchesEmail = account.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Search by game name
    const hasMatchingGame = account.games?.some(game => 
      game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Filter by games
    const matchesGames = selectedGameIds.length === 0 || 
      (account.games && account.games.some(game => selectedGameIds.includes(game.id)));
      
    return (matchesEmail || hasMatchingGame) && matchesGames;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container py-8">
        <SectionTitle 
          title="Contas Disponíveis" 
          subtitle="Encontre uma conta com os jogos que você quer jogar"
        />
        
        {/* Filtros */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar contas ou jogos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 text-white">
                <Filter className="h-4 w-4" />
                Filtrar por Jogos
                {selectedGameIds.length > 0 && (
                  <span className="ml-2 rounded-full bg-primary w-5 h-5 text-[10px] flex items-center justify-center text-primary-foreground">
                    {selectedGameIds.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <h3 className="font-medium mb-2">Jogos</h3>
              <Separator className="mb-3" />
              <div className="max-h-60 overflow-y-auto pr-2">
                {uniqueGames.map(game => (
                  <div key={game.id} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`game-${game.id}`}
                      checked={selectedGameIds.includes(game.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedGameIds([...selectedGameIds, game.id]);
                        } else {
                          setSelectedGameIds(selectedGameIds.filter(id => id !== game.id));
                        }
                      }}
                    />
                    <Label htmlFor={`game-${game.id}`} className="text-sm cursor-pointer">
                      {game.name}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedGameIds.length > 0 && (
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedGameIds([])}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Grid de contas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAccounts.map(account => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
        
        {/* Mensagem quando não há contas */}
        {filteredAccounts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-white">
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
