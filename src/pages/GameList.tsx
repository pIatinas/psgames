
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';
import SectionTitle from '@/components/SectionTitle';
import { Badge } from '@/components/ui/badge';
import { GamePlatform, Game } from '@/types';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { gameService } from '@/services/supabaseService';

const GameList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<GamePlatform | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // Available platforms (removed VR)
  const platforms: GamePlatform[] = ['PS5', 'PS4', 'PS3', 'VITA'];
  
  useEffect(() => {
    const loadGames = async () => {
      try {
        const gamesData = await gameService.getAll();
        setGames(gamesData);
      } catch (error) {
        console.error('Error loading games:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadGames();
  }, []);
  
  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform ? game.platform.includes(selectedPlatform) : true;
    return matchesSearch && matchesPlatform;
  });

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container py-8">
          <div className="text-center">
            <p className="text-lg text-white">Carregando jogos...</p>
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
          subtitle="Explore nossa coleção completa de jogos"
        />
        
        {/* Filtros */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar jogos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {platforms.map(platform => (
              <Badge 
                key={platform}
                variant={selectedPlatform === platform ? "default" : "outline"}
                className={`cursor-pointer ${selectedPlatform === platform ? 'bg-primary hover:bg-primary/90' : 'hover:bg-primary/10'} text-white`}
                onClick={() => setSelectedPlatform(prev => prev === platform ? null : platform)}
              >
                {platform}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Grid de jogos - 4 por linha */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
        
        {/* Mensagem quando não há jogos */}
        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-white">
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
