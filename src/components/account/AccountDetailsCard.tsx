
import React from 'react';
import { Calendar } from 'lucide-react';
import { Account } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AccountDetailsCardProps {
  account: Account;
  usedBy?: string;
}

const AccountDetailsCard: React.FC<AccountDetailsCardProps> = ({ account, usedBy }) => {
  // Calculate available slots
  const availableSlots = 2 - 
    (account.slot1 ? 1 : 0) - 
    (account.slot2 ? 1 : 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes da Conta</CardTitle>
        <CardDescription>Informações não sensíveis sobre esta conta</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium">Criada em</div>
          <div className="text-sm text-muted-foreground flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(account.created_at).toLocaleDateString()}
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium">Status dos Slots</div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className={`text-sm px-3 py-2 rounded-md ${account.slot1 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
              <div className="font-medium">Slot 1</div>
              <div>{account.slot1 ? 'Em uso' : 'Disponível'}</div>
              {account.slot1 && (
                <div className="text-xs mt-1">Por: {account.slot1.member.name}</div>
              )}
            </div>
            <div className={`text-sm px-3 py-2 rounded-md ${account.slot2 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
              <div className="font-medium">Slot 2</div>
              <div>{account.slot2 ? 'Em uso' : 'Disponível'}</div>
              {account.slot2 && (
                <div className="text-xs mt-1">Por: {account.slot2.member.name}</div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium">Quantidade de Jogos</div>
          <div className="text-sm">
            {account.games ? account.games.length : 0} jogos disponíveis
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountDetailsCard;
