
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';
import SectionTitle from '@/components/SectionTitle';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { gameService } from '@/services/supabaseService';
import { useQuery } from '@tanstack/react-query';
import { GamePlatform } from '@/types';

const GameList = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<GamePlatform[]>([]);
  
  const { data: games = [], isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: () => gameService.getAll(),
  });
  
  const platforms: GamePlatform[] = ["PS5", "PS4", "PS3", "VITA"];
  
  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatforms.length === 0 || 
                           selectedPlatforms.some(platform => game.platform.includes(platform));
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
            <p className="text-lg text-muted-foreground">Carregando jogos...</p>
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
          title="Biblioteca de Jogos" 
          subtitle="Descubra todos os jogos disponíveis em nossas contas"
        />
        
        {/* Filtros */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar jogos..."
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
        
        {/* Grid de jogos - 5 por linha */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
        
        {/* Mensagem quando não há jogos */}
        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Nenhum jogo encontrado com os filtros atuais.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default GameList;
