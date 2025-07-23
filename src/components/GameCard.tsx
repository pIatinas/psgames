
import React from 'react';
import { Link } from 'react-router-dom';
import { Game, GamePlatform } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface GameCardProps {
  game: Game;
  getPlatformColor?: (platform: GamePlatform) => string;
}

const GameCard: React.FC<GameCardProps> = ({ game, getPlatformColor }) => {
  const defaultPlatformColor = (platform: GamePlatform): string => {
    const colorMap: Record<GamePlatform, string> = {
      "PS5": "bg-blue-500 text-white",
      "PS4": "bg-indigo-500 text-white",
      "PS3": "bg-purple-500 text-white",
      "VITA": "bg-green-500 text-white"
    };
    
    return colorMap[platform] || "bg-gray-500 text-white";
  };

  const getColor = getPlatformColor || defaultPlatformColor;

  return (
    <Link to={`/games/${game.id}`}>
      <Card className="overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-md">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img 
            src={game.image || '/placeholder.svg'} 
            alt={game.name}
            className="h-full w-full object-cover"
          />
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm md:text-base line-clamp-1 text-white">{game.name}</h3>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {game.platform.map(platform => (
              <span 
                key={platform} 
                className={`text-xs px-2 py-1 rounded-full ${getColor(platform as GamePlatform)}`}
              >
                {platform}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default GameCard;
