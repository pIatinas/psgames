
import React from 'react';
import { Link } from 'react-router-dom';
import { Game } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface GameCardProps {
  game: Game;
  className?: string;
}

const GameCard: React.FC<GameCardProps> = ({ game, className = '' }) => {
  return (
    <Link to={`/games/${game.id}`} className={`block ${className}`}>
      <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:neon-border rounded-lg">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={game.image} 
            alt={game.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-2">
            {game.platform.map((platform) => (
              <Badge 
                key={platform} 
                className="bg-primary/80 hover:bg-primary text-white text-xs"
              >
                {platform}
              </Badge>
            ))}
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-base line-clamp-2">{game.name}</h3>
          <div className="mt-1 text-xs text-muted-foreground">
            Adicionado: {new Date(game.created_at).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default GameCard;
