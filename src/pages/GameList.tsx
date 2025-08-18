import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';
import SectionTitle from '@/components/SectionTitle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { gameService } from '@/services/supabaseService';
import { useQuery } from '@tanstack/react-query';
import { GamePlatform } from '@/types';
import Loader from '@/components/Loader';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
const GameList = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<GamePlatform[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const {
    data: games = [],
    isLoading
  } = useQuery({
    queryKey: ['games'],
    queryFn: () => gameService.getAll()
  });
  const platforms: GamePlatform[] = ["PS5", "PS4", "PS3"];
  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatforms.length === 0 || selectedPlatforms.some(platform => game.platform.includes(platform));
    return matchesSearch && matchesPlatform;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGames = filteredGames.slice(startIndex, startIndex + itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedPlatforms]);
  const togglePlatform = (platform: GamePlatform) => {
    setSelectedPlatforms(prev => prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]);
  };
  if (isLoading) {
    return <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Loader />
        </main>
        <Footer />
      </div>;
  }
  return <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="container py-4">
          <Breadcrumbs />
        </div>
        
        <div className="container pb-8">
        <SectionTitle title="Jogos Disponíveis" subtitle="Descubra todos os jogos disponíveis em nossas contas" />
        
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap mt-7 ">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">Plataformas:</span>
              {platforms.map(platform => <Button key={platform} variant={selectedPlatforms.includes(platform) ? "default" : "outline"} size="sm" onClick={() => togglePlatform(platform)} className={selectedPlatforms.includes(platform) ? "bg-pink-600 hover:bg-pink-700" : ""}>
                  {platform}
                </Button>)}
              {selectedPlatforms.length > 0 && <Button variant="ghost" size="sm" onClick={() => setSelectedPlatforms([])}>
                  Limpar
                </Button>}
            </div>
            <div className="w-full sm:w-64">
              <Input placeholder="Pesquisar jogos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </div>
        
        {/* Grid de jogos - 5 por linha */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedGames.map(game => <GameCard key={game.id} game={game} />)}
        </div>
        
        {/* Paginação */}
        {filteredGames.length > itemsPerPage && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
        
        {/* Mensagem quando não há jogos */}
        {filteredGames.length === 0 && <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Nenhum jogo encontrado com os filtros atuais.
            </p>
          </div>}
        </div>
      </main>

      <Footer />
    </div>;
};
export default GameList;