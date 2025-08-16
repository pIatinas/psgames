
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface SeeAllButtonProps {
  to: string;
  label?: string;
}

const SeeAllButton: React.FC<SeeAllButtonProps> = ({
  to,
  label = 'Ver Todos'
}) => {
  return (
    <div className="flex justify-center">
      <Button 
        size="lg" 
        className="bg-pink-600 hover:bg-pink-700 text-white rounded-full group"
        asChild
      >
        <Link to={to}>
          <span>{label}</span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  );
};

export default SeeAllButton;
