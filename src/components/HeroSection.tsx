import React from 'react';
import { Link } from 'react-router-dom';
import { Game } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
interface HeroSectionProps {
  games: Game[];
}
const HeroSection: React.FC<HeroSectionProps> = ({ games }) => {
  return (
    <div className="hero-section">
      <h1 className="text-2xl font-bold">Bem-vindo ao GameShare</h1>
      <p className="text-muted-foreground">Compartilhe e jogue os melhores jogos.</p>
    </div>
  );
};
export default HeroSection;