
import React from 'react';
import { Game } from '@/types';
import GameCard from '@/components/GameCard';
import SectionTitle from '@/components/SectionTitle';

interface AccountGamesListProps {
  games: Game[] | undefined;
}

const AccountGamesList: React.FC<AccountGamesListProps> = ({ games }) => {
  return (
    <div>
      <SectionTitle 
        title="Jogos nesta Conta" 
        subtitle={`${games?.length || 0} jogos disponíveis`}
      />
      
      {games && games.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {games.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          Esta conta não possui jogos cadastrados.
        </p>
      )}
    </div>
  );
};

export default AccountGamesList;
