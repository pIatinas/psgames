import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Game } from '@/types';
import { Link } from 'react-router-dom';
import { generateGameSlug } from '@/utils/gameUtils';
import ImagePlaceholder from '@/components/ui/image-placeholder';
interface GameCardProps {
  game: Game;
}
const GameCard: React.FC<GameCardProps> = ({
  game
}) => {
  return <Card className="h-full hover:shadow-lg hover:scale-105 transition-all overflow-hidden cursor-pointer border-0 bg-transparent">
      <Link to={`/games/${generateGameSlug(game.id, game.name)}`} className="block h-full">
        <div className="aspect-square relative">
          <ImagePlaceholder src={game.image} alt={game.name} className="w-full h-full object-cover" />
          {/* Overlay gradiente de cima para baixo (preto 60% -> transparente) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/0 to-transparent" />
          {/* Nome do jogo no topo esquerdo */}
          <div className="absolute top-2 left-2 text-white px-2 py-1 rounded text-lg font-semibold max-w-[calc(100%-1rem)] bg-transparent text-shadow">
            <div className="line-clamp-2">{game.name}</div>
          </div>
          {/* Plataformas no canto inferior direito */}
          <div className="absolute bottom-2 right-2 flex flex-wrap gap-1 justify-end">
            {game.platform.map(platform => <Badge key={platform} variant="secondary" className="text-xs bg-black/70 text-white border-0">
                {platform}
              </Badge>)}
          </div>
        </div>
      </Link>
    </Card>;
};
export default GameCard;