
import React from 'react';
import { Link } from 'react-router-dom';
import { Game } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  games: Game[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ games }) => {
  // Pegar o último jogo adicionado para destaque
  const featuredGame = games[0];

  return (
    <section className="relative h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden">
      {/* Imagem de fundo */}
      <div className="absolute inset-0 z-0">
        <img 
          src={featuredGame.banner} 
          alt={featuredGame.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30"></div>
      </div>

      {/* Conteúdo */}
      <div className="container relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gradient">Compartilhe Jogos</span>
            <br />
            <span className="text-white">Com Nossa Comunidade</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-md">
            Acesse nossa biblioteca de jogos para PS5 e compartilhe experiências em uma comunidade exclusiva.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white" asChild>
              <Link to="/games">
                Ver Jogos
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary/60 hover:border-primary hover:bg-primary/20" asChild>
              <Link to="/accounts">Ver Contas</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decoração neon */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>
    </section>
  );
};

export default HeroSection;
