
import React from 'react';
import { Calendar, User } from 'lucide-react';
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
  const usedSlots = account.slots?.length || 0;
  const availableSlots = 2 - usedSlots;

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
            {[1, 2].map(slotNumber => {
              const slot = account.slots?.find(s => s.slot_number === slotNumber);
              const isOccupied = !!slot;
              
              return (
                <div key={slotNumber} className={`text-sm px-3 py-2 rounded-md ${isOccupied ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                  <div className="font-medium">Slot {slotNumber}</div>
                  <div>{isOccupied ? 'Em uso' : 'Disponível'}</div>
                  {isOccupied && slot?.user_id && (
                    <div className="flex items-center mt-1 text-xs gap-1">
                      <User className="h-3 w-3" />
                      Usuário ocupando
                    </div>
                  )}
                </div>
              );
            })}
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
