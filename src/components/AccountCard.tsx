
import React from 'react';
import { Link } from 'react-router-dom';
import { Account } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

interface AccountCardProps {
  account: Account;
  className?: string;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, className = '' }) => {
  // Calcular quantos slots estão ocupados
  const usedSlots = [account.slot1, account.slot2].filter(Boolean).length;
  const totalSlots = 2;
  
  return (
    <Link to={`/accounts/${account.id}`} className={`block ${className}`}>
      <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:neon-blue-border rounded-lg">
        <div className="relative p-4 bg-muted/50 flex justify-center items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-secondary/20 text-secondary">
            <svg 
              className="h-8 w-8" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm-.5 5v6H5v2h6.5v6h1v-6H19v-2h-6.5V5h-1z" />
            </svg>
          </div>
          <div className="absolute top-2 right-2 flex items-center gap-1 text-xs">
            <User className="h-3.5 w-3.5 text-secondary" />
            <span className="font-medium">{usedSlots}/{totalSlots}</span>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-base line-clamp-2">{account.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {account.games ? `${account.games.length} jogos` : "Sem jogos"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default AccountCard;
