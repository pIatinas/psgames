
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

  const getSlotUser = (slotNumber: number) => {
    const slot = account.slots?.find(s => s.slot_number === slotNumber);
    return slot?.user ? slot.user.name.split(' ')[0] : null;
  };

  const isSlotOccupied = (slotNumber: number) => {
    return getSlotUser(slotNumber) !== null;
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
      <Link to={`/accounts/${generateAccountSlug(account.id, account.email)}`} className="block">
        <CardContent className="p-4 space-y-3 flex flex-col h-full">
          <div className="text-sm font-mono">{account.email}</div>

          {!showPassword && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword(true);
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ativar
              </Button>
            </div>
          )}

          {showPassword && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Senha:</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(false);
                  }}
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              </div>
              <div className="font-mono text-sm mb-3">
                {account.password}
              </div>
            </div>
          )}

          {account.games && account.games.length > 0 && (
            <div className="flex-grow">
              <div className="text-sm font-medium mb-2">Jogos:</div>
              <div className="flex flex-wrap gap-1">
                {account.games.slice(0, 3).map(game => (
                  <span key={game.id} className="text-xs px-2 py-1 rounded border">
                    {game.name}
                  </span>
                ))}
                {account.games.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded border">
                    +{account.games.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-auto space-y-2">
            <div className="flex gap-2">
              <Badge 
                variant={isSlotOccupied(1) ? "destructive" : "secondary"}
                className={`flex-1 justify-center text-xs ${
                  isSlotOccupied(1) ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}
              >
                Slot 1{isSlotOccupied(1) ? `: ${getSlotUser(1)}` : ''}
              </Badge>
              <Badge 
                variant={isSlotOccupied(2) ? "destructive" : "secondary"}
                className={`flex-1 justify-center text-xs ${
                  isSlotOccupied(2) ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}
              >
                Slot 2{isSlotOccupied(2) ? `: ${getSlotUser(2)}` : ''}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default AccountCard;
