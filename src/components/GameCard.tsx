
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Game } from '@/types';
import ImagePlaceholder from '@/components/ui/image-placeholder';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <Link to={`/games/${game.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-0">
          <div className="relative aspect-square">
            <ImagePlaceholder
              src={game.image}
              alt={game.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
            {/* Nome do jogo no topo esquerdo */}
            <div className="absolute top-2 left-2">
              <div className="bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                {game.name.length > 20 ? `${game.name.slice(0, 20)}...` : game.name}
              </div>
            </div>
            {/* Plataformas no bottom direito */}
            <div className="absolute bottom-2 right-2">
              <div className="flex flex-wrap gap-1 justify-end">
                {game.platform.slice(0, 2).map((platform) => (
                  <Badge key={platform} variant="secondary" className="text-xs bg-black/70 text-white">
                    {platform}
                  </Badge>
                ))}
                {game.platform.length > 2 && (
                  <Badge variant="secondary" className="text-xs bg-black/70 text-white">
                    +{game.platform.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default GameCard;
