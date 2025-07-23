
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Game } from '@/types';
import { Link } from 'react-router-dom';
import { generateGameSlug } from '@/utils/gameUtils';
import ImagePlaceholder from '@/components/ui/image-placeholder';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const truncateText = (text: string, lines: number = 2) => {
    const words = text.split(' ');
    const wordsPerLine = 8;
    const maxWords = lines * wordsPerLine;
    
    if (words.length <= maxWords) {
      return text;
    }
    
    return words.slice(0, maxWords).join(' ') + '...';
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
      <div className="aspect-square relative">
        <ImagePlaceholder
          src={game.image}
          alt={game.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{game.name}</h3>
        {game.description && (
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            {truncateText(game.description, 2)}
          </p>
        )}
        <div className="flex flex-wrap gap-1 mb-3">
          {game.platform.map((platform) => (
            <Badge key={platform} variant="secondary" className="text-xs">
              {platform}
            </Badge>
          ))}
        </div>
        <Button asChild className="w-full" size="sm">
          <Link to={`/games/${generateGameSlug(game.id, game.name)}`}>
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameCard;
