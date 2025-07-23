
import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/HeroSection';
import SectionTitle from '@/components/SectionTitle';
import GameCard from '@/components/GameCard';
import AccountCard from '@/components/AccountCard';
import SeeAllButton from '@/components/SeeAllButton';
import { useQuery } from '@tanstack/react-query';
import { gameService, accountService } from '@/services/supabaseService';

const Index: React.FC = () => {
  const { data: games = [] } = useQuery({
    queryKey: ['games'],
    queryFn: () => gameService.getAll(),
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountService.getAll(),
  });

  const featuredGames = games.slice(0, 10);
  const featuredAccounts = accounts.slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection games={games} />
      
      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Jogos em Destaque */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <SectionTitle title="Jogos em Destaque" />
            <SeeAllButton to="/games" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {featuredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* Contas Disponíveis */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <SectionTitle title="Contas Disponíveis" />
            <SeeAllButton to="/accounts" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAccounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
