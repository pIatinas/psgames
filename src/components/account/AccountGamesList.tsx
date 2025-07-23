
import React from 'react';
import { Game, GamePlatform } from '@/types';
import GameCard from '@/components/GameCard';
import SectionTitle from '@/components/SectionTitle';

interface AccountGamesListProps {
  games: Game[] | undefined;
}

const AccountGamesList: React.FC<AccountGamesListProps> = ({ games }) => {
  // Define platform color map
  const getPlatformColor = (platform: GamePlatform): string => {
    const colorMap: Record<GamePlatform, string> = {
      "PS5": "bg-blue-500 text-white",
      "PS4": "bg-indigo-500 text-white",
      "PS3": "bg-purple-500 text-white", 
      "VITA": "bg-green-500 text-white"
    };
    
    return colorMap[platform] || "bg-gray-500 text-white";
  };

  return (
    <div>
      <SectionTitle 
        title="Jogos nesta Conta" 
        subtitle={`${games?.length || 0} jogos disponíveis`}
      />
      
      {games && games.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {games.map(game => (
            <GameCard key={game.id} game={game} getPlatformColor={getPlatformColor} />
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
