
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
import { games, accounts } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, Users } from 'lucide-react';
import AccountCard from '@/components/AccountCard';

const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  
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
          <h2 className="text-2xl font-bold mb-4">Jogo não encontrado</h2>
          <p className="text-muted-foreground mb-6">
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
              <div className="hidden md:block w-36 h-48 rounded-lg overflow-hidden neon-border">
                <img 
                  src={game.image} 
                  alt={game.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{game.name}</h1>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {game.platform.map(platform => (
                    <Badge 
                      key={platform} 
                      className="bg-primary/80 hover:bg-primary"
                    >
                      {platform}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Descrição */}
              <div>
                <SectionTitle title="Sobre o Jogo" />
                <p className="text-muted-foreground">
                  Este é um jogo exclusivo disponível em nosso sistema de compartilhamento.
                  Você pode acessá-lo através de uma das contas listadas ao lado.
                </p>
              </div>
              
              {/* Contas que possuem o jogo */}
              <div>
                <SectionTitle 
                  title="Contas com este Jogo" 
                  subtitle={`${relatedAccounts.length} ${relatedAccounts.length === 1 ? 'conta possui' : 'contas possuem'} este jogo`}
                />
                
                {relatedAccounts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {relatedAccounts.map(account => (
                      <AccountCard key={account.id} account={account} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Nenhuma conta possui este jogo no momento.
                  </p>
                )}
              </div>
            </div>
            
            {/* Barra lateral */}
            <div>
              <div className="glass-card rounded-lg p-6 sticky top-20">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="h-5 w-5 text-secondary" />
                  <h3 className="font-semibold">
                    {relatedAccounts.length} {relatedAccounts.length === 1 ? 'conta disponível' : 'contas disponíveis'}
                  </h3>
                </div>
                
                {relatedAccounts.length > 0 ? (
                  <Button 
                    size="lg" 
                    className="w-full bg-primary hover:bg-primary/90" 
                    asChild
                  >
                    <Link to={`/accounts/${relatedAccounts[0].id}`}>
                      Ver Conta Disponível
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="w-full" 
                    variant="outline" 
                    disabled
                  >
                    Sem Contas Disponíveis
                  </Button>
                )}
                
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  Para jogar este título, você deve ser um membro aprovado.
                </div>
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
