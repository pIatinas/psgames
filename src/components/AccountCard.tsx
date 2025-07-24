
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { Account } from '@/types';
import { Link } from 'react-router-dom';
import { generateAccountSlug } from '@/utils/gameUtils';

interface AccountCardProps {
  account: Account;
}

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const [showPassword, setShowPassword] = useState(false);

  const getSlotStatus = (slotNumber: number) => {
    const slot = account.slots?.find(s => s.slot_number === slotNumber);
    return slot ? 'Ocupado' : 'Livre';
  };

  const isSlotOccupied = (slotNumber: number) => {
    return getSlotStatus(slotNumber) === 'Ocupado';
  };

  const getSlotUser = (slotNumber: number) => {
    const slot = account.slots?.find(s => s.slot_number === slotNumber);
    return slot ? `Usuário ${slot.user_id?.slice(0, 8)}` : 'Livre';
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
      <Link to={`/accounts/${generateAccountSlug(account.id, account.email)}`} className="block">
        <CardContent className="p-4 space-y-3">
          <div>
            <div className="text-sm font-medium mb-1">Email:</div>
            <div className="text-sm font-mono">{account.email}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Senha:</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <div className="font-mono text-sm">
            {showPassword ? account.password : '••••••••'}
          </div>

          {account.games && account.games.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Jogos:</div>
              <div className="flex flex-wrap gap-1">
                {account.games.slice(0, 3).map(game => (
                  <Badge key={game.id} variant="secondary" className="text-xs">
                    {game.name}
                  </Badge>
                ))}
                {account.games.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{account.games.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex gap-2">
              <Badge 
                variant={isSlotOccupied(1) ? "destructive" : "secondary"}
                className="flex-1 justify-center text-xs"
              >
                Slot 1: {getSlotUser(1)}
              </Badge>
              <Badge 
                variant={isSlotOccupied(2) ? "destructive" : "secondary"}
                className="flex-1 justify-center text-xs"
              >
                Slot 2: {getSlotUser(2)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default AccountCard;
