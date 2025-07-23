
import React from 'react';
import { Link } from 'react-router-dom';
import { Account } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';
import ImagePlaceholder from '@/components/ui/image-placeholder';

interface AccountCardProps {
  account: Account;
  className?: string;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, className = '' }) => {
  // Calcular quantos slots estão ocupados
  const usedSlots = account.slots?.length || 0;
  const totalSlots = 2;
  
  const accountPlaceholder = `https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop`;

  return (
    <Link to={`/accounts/${account.id}`} className={`block ${className}`}>
      <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:neon-blue-border rounded-lg h-full">
        <div className="relative">
          <ImagePlaceholder
            src={account.qr_code}
            alt={account.email}
            fallbackSrc={accountPlaceholder}
            className="aspect-square"
          >
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 px-2 py-1 rounded-full text-xs">
              <User className="h-3.5 w-3.5 text-secondary" />
              <span className="font-medium text-white">{usedSlots}/{totalSlots}</span>
            </div>
          </ImagePlaceholder>
        </div>
        <CardContent className="p-3">
          <div className="text-sm text-foreground mt-1">
            {account.games ? `${account.games.length} jogos` : "Sem jogos"}
          </div>
          {account.games && account.games.length > 0 && (
            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {account.games.slice(0, 3).map(game => game.name).join(', ')}
              {account.games.length > 3 && ` +${account.games.length - 3} mais`}
            </div>
          )}
          {account.slots && account.slots.length > 0 && (
            <div className="text-xs mt-2 space-y-1">
              {account.slots.map(slot => (
                <div key={slot.id} className="bg-red-500/20 text-red-500 rounded px-2 py-1">
                  Slot {slot.slot_number}: Em uso
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default AccountCard;
