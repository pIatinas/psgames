
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Account } from '@/types';
import { Link } from 'react-router-dom';
import { generateAccountSlug } from '@/utils/gameUtils';

interface AccountCardProps {
  account: Account;
}

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const getSlotUser = (slotNumber: number) => {
    const slot = account.slots?.find(s => s.slot_number === slotNumber);
    return slot?.user ? slot.user.name.split(' ')[0] : null;
  };

  const isSlotOccupied = (slotNumber: number) => {
    return getSlotUser(slotNumber) !== null;
  };

  const occupiedSlots = account.slots?.filter(slot => slot.user_id)?.length || 0;
  const isFullyOccupied = occupiedSlots >= 2;

  return (
    <Card className={`h-full hover:shadow-lg transition-all cursor-pointer ${isFullyOccupied ? 'opacity-60' : ''}`}>
      <Link to={`/accounts/${generateAccountSlug(account.id, account.email)}`} className="block">
        <CardContent className="p-4 space-y-3 flex flex-col h-full">
          <div className="text-sm font-mono">{account.email}</div>

          {account.games && account.games.length > 0 && (
            <div className="flex-grow">
              <div className="flex flex-wrap gap-1">
                {account.games.slice(0, 3).map(game => (
                  <span key={game.id} className="text-xs px-2 py-1 rounded">
                    {game.name}
                  </span>
                ))}
                {account.games.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded">
                    +{account.games.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-auto space-y-2">
            <div className="flex gap-2">
              <div 
                className={`flex-1 text-center p-2 rounded text-xs ${
                  isSlotOccupied(1) 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}
              >
                {isSlotOccupied(1) ? getSlotUser(1) : 'Livre'}
              </div>
              <div 
                className={`flex-1 text-center p-2 rounded text-xs ${
                  isSlotOccupied(2) 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}
              >
                {isSlotOccupied(2) ? getSlotUser(2) : 'Livre'}
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default AccountCard;
