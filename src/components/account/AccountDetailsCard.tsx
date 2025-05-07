
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
}

const AccountDetailsCard: React.FC<AccountDetailsCardProps> = ({ account }) => {
  return (
    <Card className="glass-card">
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
          <div className="flex gap-4 mt-2">
            <div className={`text-sm px-3 py-1 rounded-md ${account.slot1 ? 'bg-destructive/20 text-destructive' : 'bg-green-500/20 text-green-500'}`}>
              Slot 1: {account.slot1 ? 'Em uso' : 'Disponível'}
            </div>
            <div className={`text-sm px-3 py-1 rounded-md ${account.slot2 ? 'bg-destructive/20 text-destructive' : 'bg-green-500/20 text-green-500'}`}>
              Slot 2: {account.slot2 ? 'Em uso' : 'Disponível'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountDetailsCard;
