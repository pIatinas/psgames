import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Game } from '@/types';
import { gameService } from '@/services/supabaseService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { generateGameSlug } from '@/utils/gameUtils';
import SectionTitle from '@/components/SectionTitle';

interface RelatedGamesProps {
  currentGame: Game;
}

const RelatedGames: React.FC<RelatedGamesProps> = ({ currentGame }) => {
  const { data: allGames = [] } = useQuery({
    queryKey: ['games'],
    queryFn: () => gameService.getAll(),
  });

  // Filter related games by genre, excluding the current game
  const relatedGames = allGames
    .filter(game => 
      game.id !== currentGame.id && 
      game.genre && 
      currentGame.genre && 
      game.genre.toLowerCase() === currentGame.genre.toLowerCase()
    )
    .slice(0, 4);

  if (relatedGames.length === 0) {
    return null;
  }

  return (
    <div>
      <SectionTitle title="Jogos Relacionados" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedGames.map(game => (
          <Link 
            key={game.id} 
            to={`/games/${generateGameSlug(game.id, game.name)}`}
            className="block"
          >
            <Card className="h-full hover:scale-105 transition-all cursor-pointer">
              <CardContent className="p-3">
                <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3">
                  <img 
                    src={game.image} 
                    alt={game.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-medium text-sm truncate mb-2 text-white">{game.name}</h4>
                <div className="flex flex-wrap gap-1">
                  {game.platform.slice(0, 2).map(platform => (
                    <Badge key={platform} variant="secondary" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedGames;