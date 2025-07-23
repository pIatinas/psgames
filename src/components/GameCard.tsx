
import React from 'react';
import { Link } from 'react-router-dom';
import { Game } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ImagePlaceholder from '@/components/ui/image-placeholder';

interface GameCardProps {
  game: Game;
  className?: string;
}

const GameCard: React.FC<GameCardProps> = ({ game, className = '' }) => {
  const gamePlaceholder = `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=600&fit=crop`;

  return (
    <Link to={`/games/${game.id}`} className={`block ${className}`}>
      <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:neon-blue-border rounded-lg h-full">
        <ImagePlaceholder
          src={game.image}
          alt={game.name}
          fallbackSrc={gamePlaceholder}
          className="aspect-[3/4]"
        />
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2">{game.name}</h3>
          {game.platform && game.platform.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {game.platform.slice(0, 2).map(platform => (
                <Badge key={platform} variant="outline" className="text-xs">
                  {platform}
                </Badge>
              ))}
              {game.platform.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{game.platform.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default GameCard;
