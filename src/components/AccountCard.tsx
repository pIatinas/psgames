
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Users } from 'lucide-react';
import { Account } from '@/types';
import { Link } from 'react-router-dom';

interface AccountCardProps {
  account: Account;
}

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const getSlotStatus = (slotNumber: number) => {
    const slot = account.slots?.find(s => s.slot_number === slotNumber);
    return slot ? 'Ocupado' : 'Livre';
  };

  const isSlotOccupied = (slotNumber: number) => {
    return getSlotStatus(slotNumber) === 'Ocupado';
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{account.email}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium mb-2">Senha:</div>
          <div className="font-mono text-sm bg-muted p-2 rounded">
            ••••••••
          </div>
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
          <div className="text-sm font-medium">Slots:</div>
          <div className="flex gap-2">
            <Badge 
              variant={isSlotOccupied(1) ? "destructive" : "secondary"}
              className="flex-1 justify-center"
            >
              Slot 1: {getSlotStatus(1)}
            </Badge>
            <Badge 
              variant={isSlotOccupied(2) ? "destructive" : "secondary"}
              className="flex-1 justify-center"
            >
              Slot 2: {getSlotStatus(2)}
            </Badge>
          </div>
        </div>

        <Button asChild className="w-full">
          <Link to={`/accounts/${account.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
