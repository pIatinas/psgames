import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
import { gameService, accountService } from '@/services/supabaseService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, Trophy, Check, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fetchGameInfo } from '@/services/gameInfoService';
import { Game, Account } from '@/types';
import { parseGameSlug, generateAccountSlug } from '@/utils/gameUtils';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedGames from '@/components/RelatedGames';
import ImagePlaceholder from '@/components/ui/image-placeholder';

// Interface for trophy data
interface TrophyInfo {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
  total: number;
}
const GameDetail = () => {
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const {
    currentUser
  } = useAuth();
  const [trophyInfo, setTrophyInfo] = useState<TrophyInfo | null>(null);
  const [gameDetails, setGameDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Extract game ID from slug
  const gameId = slug ? parseGameSlug(slug) : null;

  // Fetch game data
  const {
    data: game,
    isLoading: gameLoading
  } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => gameId ? gameService.getById(gameId) : null,
    enabled: !!gameId
  });

  // Fetch accounts with this game
  const {
    data: allAccounts = []
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountService.getAll()
  });
  const gameAccounts = allAccounts.filter(account => account.games?.some(g => g.id === gameId));

  // Fetch trophy info and game details
  useEffect(() => {
    if (game) {
      const fetchDetails = async () => {
        try {
          const details = await fetchGameInfo(game);
          setTrophyInfo(details.trophyInfo || null);
          setGameDetails(details);
        } catch (error) {
          console.error("Error fetching game details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [game]);

  // Se o jogo não for encontrado
  if (gameLoading || !game) {
    return <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          {gameLoading ? <Loader /> : <div className="container py-16 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold mb-4 text-white">Jogo não encontrado</h2>
              <p className="text-white mb-6">Não foi possível encontrar o jogo solicitado.</p>
              <Button asChild>
                <Link to="/games">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para jogos
                </Link>
              </Button>
            </div>}
        </main>
        
        <Footer />
      </div>;
  }
  return <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow relative ">
        {/* Breadcrumbs and Back Button */}
        <div className="container py-4 absolute z-10 top-0 left-0 right-0 w-full ">
          <nav className="flex items-center justify-between mx-auto ">
            <div className="flex items-center space-x-2">
              <Link to="/" className="text-white/80 hover:text-white">Início</Link>
              <span className="text-white/60">/</span>
              <Link to="/games" className="text-white/80 hover:text-white">Jogos</Link>
              <span className="text-white/60">/</span>
              <span className="text-white">{game?.name}</span>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white" asChild>
              <Link to="/games">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
          </nav>
        </div>
        
        {/* Hero Banner */}
        <div className="relative h-[40vh] min-h-[300px] max-h-[500px]">
          {game.banner ? <img src={game.banner} alt={game.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50" />}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 container py-8">
            
            <div className="flex items-end gap-6">
              <div className="hidden md:block w-48 h-48 rounded-lg overflow-hidden shadow-lg">
                <ImagePlaceholder src={game.image} alt={game.name} className="w-full h-full" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">{game.name}</h1>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {game.platform.map(platform => <Badge key={platform} className="bg-primary/80 hover:bg-primary text-white">
                      {platform}
                    </Badge>)}
                </div>
                
                <div className="flex items-center text-sm text-white">
                  <span>
                    Adicionado em {new Date(game.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Conteúdo da página */}
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Trophy counts from database - moved above description */}
              {(game.platinum || game.gold || game.silver || game.bronze) && (game.platinum || 0) + (game.gold || 0) + (game.silver || 0) + (game.bronze || 0) > 0 && <div>
                  <SectionTitle title="Troféus" />
                  <div className="grid grid-cols-5 gap-2">
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-yellow-400 mb-1">
                        <Trophy className="h-4 w-4 mx-auto" />
                      </div>
                      <div className="text-lg font-bold text-white">{game.platinum || 0}</div>
                      <div className="text-xs text-white">Platina</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-yellow-300 mb-1">
                        <Trophy className="h-4 w-4 mx-auto" />
                      </div>
                      <div className="text-lg font-bold text-white">{game.gold || 0}</div>
                      <div className="text-xs text-white">Ouro</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-gray-300 mb-1">
                        <Trophy className="h-4 w-4 mx-auto" />
                      </div>
                      <div className="text-lg font-bold text-white">{game.silver || 0}</div>
                      <div className="text-xs text-white">Prata</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-amber-700 mb-1">
                        <Trophy className="h-4 w-4 mx-auto" />
                      </div>
                      <div className="text-lg font-bold text-white">{game.bronze || 0}</div>
                      <div className="text-xs text-white">Bronze</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-primary mb-1">
                        <Trophy className="h-4 w-4 mx-auto" />
                      </div>
                      <div className="text-lg font-bold text-white">
                        {(game.platinum || 0) + (game.gold || 0) + (game.silver || 0) + (game.bronze || 0)}
                      </div>
                      <div className="text-xs text-white">Total</div>
                    </div>
                  </div>
                </div>}

              {/* Game description */}
              <div>
                <SectionTitle title="Descrição" />
                <p className="text-white">
                  {gameDetails?.description || game.description || "Este é um jogo exclusivo disponível em nosso sistema de compartilhamento."}
                </p>
                
                {/* Game info with new fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {(gameDetails?.developer || game.developer) && <div className="p-4 bg-gray-800/20 rounded-lg">
                      <div className="text-sm font-bold text-white ">Desenvolvedor</div>
                      <div className="text-white font-normal ">{gameDetails?.developer || game.developer}</div>
                    </div>}
                  {(gameDetails?.genre || game.genre) && <div className="p-4 bg-gray-800/20 rounded-lg">
                      <div className="text-sm font-bold text-white">Gênero</div>
                      <div className="text-white font-normal ">{gameDetails?.genre || game.genre}</div>
                    </div>}
                  {(game.launch_date || game.release_date) && <div className="p-4 bg-gray-800/20 rounded-lg">
                      <div className="text-sm font-bold text-white">Lançamento</div>
                      <div className="text-white font-normal ">
                        {new Date(game.launch_date || game.release_date).toLocaleDateString()}
                      </div>
                    </div>}
                </div>
              </div>

              {/* Related Games */}
              <RelatedGames currentGame={game} />
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              
              {/* Accounts with this game */}
              <div>
                <SectionTitle title="Conta" subtitle={`${gameAccounts.length} ${gameAccounts.length === 1 ? 'conta disponível' : 'contas disponíveis'}`} />
                
                 {gameAccounts.length > 0 ? <div className="grid grid-cols-1 gap-4">
                     {gameAccounts.map(account => <AccountCard key={account.id} account={account} />)}
                   </div> : <p className="text-white">Nenhuma conta encontrada com este jogo.</p>}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>;
};

// Updated account card component to show member names
const AccountCard = ({
  account
}: {
  account: Account;
}) => {
  // Helper functions for slot management
  const getSlotByNumber = (slotNumber: number) => {
    return account.slots?.find(slot => slot.slot_number === slotNumber);
  };
  const isSlotOccupied = (slotNumber: number) => {
    return getSlotByNumber(slotNumber) !== undefined;
  };
  return <div className="border rounded-lg p-4 mt-3">
      <div className="flex justify-between mb-2">
        <h3 className="font-medium text-white">
          {account.email.split('@')[0]}
        </h3>
        <Badge variant="outline" className="text-white">
          {account.games?.length || 0} jogos
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className={`p-3 rounded text-center ${!isSlotOccupied(1) ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
          <div className="text-xs">Slot 1</div>
          {isSlotOccupied(1) ? <div className="flex items-center justify-center mt-1 flex-col">
              <User className="h-4 w-4" />
              <span className="text-xs mt-1">Ocupado</span>
            </div> : <div className="flex justify-center mt-1">
              <Check className="h-4 w-4" />
            </div>}
        </div>
        
        <div className={`p-3 rounded text-center ${!isSlotOccupied(2) ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
          <div className="text-xs">Slot 2</div>
          {isSlotOccupied(2) ? <div className="flex items-center justify-center mt-1 flex-col">
              <User className="h-4 w-4" />
              <span className="text-xs mt-1">Ocupado</span>
            </div> : <div className="flex justify-center mt-1">
              <Check className="h-4 w-4" />
            </div>}
        </div>
      </div>
      
      <div className="mt-4">
        <Button variant="outline" className="w-full" asChild>
          <Link to={`/accounts/${generateAccountSlug(account.id, account.email)}`}>Ver Detalhes</Link>
        </Button>
      </div>
    </div>;
};
export default GameDetail;