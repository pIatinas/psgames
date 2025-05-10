
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
import { games, accounts } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, Trophy } from 'lucide-react';
import AccountCard from '@/components/AccountCard';
import { useAuth } from '@/hooks/useAuth';

// Interface for trophy data
interface TrophyInfo {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
  total: number;
}

const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [trophyInfo, setTrophyInfo] = useState<TrophyInfo | null>(null);
  
  // Fetch trophy info
  useEffect(() => {
    if (id) {
      // Simulate fetching trophy data
      setTimeout(() => {
        // Generate random trophy counts
        const bronze = Math.floor(Math.random() * 30) + 10;
        const silver = Math.floor(Math.random() * 15) + 5;
        const gold = Math.floor(Math.random() * 10) + 1;
        const platinum = Math.random() > 0.7 ? 1 : 0;
        
        setTrophyInfo({
          bronze,
          silver,
          gold,
          platinum,
          total: bronze + silver + gold + platinum
        });
      }, 500);
    }
  }, [id]);
  
  // Encontrar o jogo pelo ID
  const game = games.find(game => game.id === id);
  
  // Encontrar contas que possuem esse jogo
  const relatedAccounts = accounts.filter(account => 
    account.games?.some(g => g.id === id)
  );
  
  // Se o jogo não for encontrado
  if (!game) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow container py-16 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Jogo não encontrado</h2>
          <p className="text-white mb-6">
            Não foi possível encontrar o jogo solicitado.
          </p>
          <Button asChild>
            <Link to="/games">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para jogos
            </Link>
          </Button>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Banner */}
        <div className="relative h-[40vh] min-h-[300px] max-h-[500px]">
          <img 
            src={game.banner} 
            alt={game.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 container py-8">
            <div className="flex items-end gap-6">
              <div className="hidden md:block w-36 h-48 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={game.image} 
                  alt={game.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">{game.name}</h1>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {game.platform.filter(p => p !== "PC").map(platform => (
                    <Badge 
                      key={platform} 
                      className="bg-primary/80 hover:bg-primary"
                    >
                      {platform}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center text-sm text-white">
                  <Calendar className="h-4 w-4 mr-1" />
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
          <div className="grid grid-cols-1 gap-8">
            {/* Coluna principal */}
            <div className="space-y-8">
              {/* Trophy info */}
              {trophyInfo && (
                <div>
                  <SectionTitle title="Troféus" />
                  <div className="grid grid-cols-5 gap-4 mb-4">
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <div className="text-yellow-400 mb-2">
                        <Trophy className="h-6 w-6 mx-auto" />
                      </div>
                      <div className="text-xl font-bold text-white">{trophyInfo.platinum}</div>
                      <div className="text-xs text-gray-300">Platina</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <div className="text-yellow-300 mb-2">
                        <Trophy className="h-6 w-6 mx-auto" />
                      </div>
                      <div className="text-xl font-bold text-white">{trophyInfo.gold}</div>
                      <div className="text-xs text-gray-300">Ouro</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <div className="text-gray-300 mb-2">
                        <Trophy className="h-6 w-6 mx-auto" />
                      </div>
                      <div className="text-xl font-bold text-white">{trophyInfo.silver}</div>
                      <div className="text-xs text-gray-300">Prata</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <div className="text-amber-700 mb-2">
                        <Trophy className="h-6 w-6 mx-auto" />
                      </div>
                      <div className="text-xl font-bold text-white">{trophyInfo.bronze}</div>
                      <div className="text-xs text-gray-300">Bronze</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <div className="text-primary mb-2">
                        <Trophy className="h-6 w-6 mx-auto" />
                      </div>
                      <div className="text-xl font-bold text-white">{trophyInfo.total}</div>
                      <div className="text-xs text-gray-300">Total</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Game description */}
              <div>
                <SectionTitle title="Sobre o Jogo" />
                <p className="text-white">
                  Este é um jogo exclusivo disponível em nosso sistema de compartilhamento.
                  Você pode acessá-lo através de uma das contas listadas abaixo.
                </p>
              </div>
              
              {/* Contas que possuem o jogo */}
              <div>
                <SectionTitle 
                  title="Contas com este Jogo" 
                  subtitle={`${relatedAccounts.length} ${relatedAccounts.length === 1 ? 'conta possui' : 'contas possuem'} este jogo`}
                />
                
                {relatedAccounts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {relatedAccounts.map(account => (
                      <AccountCard key={account.id} account={account} />
                    ))}
                  </div>
                ) : (
                  <p className="text-white">
                    Nenhuma conta possui este jogo no momento.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GameDetail;
