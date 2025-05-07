
import React from 'react';
import { Link } from 'react-router-dom';
import { Account } from '@/types';
import SectionTitle from '@/components/SectionTitle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface MemberActiveAccountsProps {
  accounts: Account[];
  memberId: string;
}

const MemberActiveAccounts: React.FC<MemberActiveAccountsProps> = ({ accounts, memberId }) => {
  const activeAccounts = accounts.filter(account => 
    (account.slot1 && account.slot1.member.id === memberId && !account.slot1.left_at) ||
    (account.slot2 && account.slot2.member.id === memberId && !account.slot2.left_at)
  );

  return (
    <div>
      <SectionTitle 
        title="Contas em Uso" 
        subtitle={
          activeAccounts.length > 0
            ? `${activeAccounts.length} ${activeAccounts.length === 1 ? 'conta ativa' : 'contas ativas'}`
            : "Nenhuma conta em uso no momento"
        }
      />
      
      {activeAccounts.length > 0 ? (
        <div className="space-y-4">
          {activeAccounts.map(account => {
            // Determinar qual slot este membro está usando
            const slotNumber = 
              (account.slot1 && account.slot1.member.id === memberId) ? 1 :
              (account.slot2 && account.slot2.member.id === memberId) ? 2 : null;
            
            // Obter o timestamp de quando o membro entrou
            const enteredAt = slotNumber === 1 ? account.slot1?.entered_at : account.slot2?.entered_at;
            
            return (
              <Card key={account.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="flex items-center justify-between">
                    {account.name}
                    <Badge>Slot {slotNumber}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {enteredAt && `Em uso desde ${new Date(enteredAt).toLocaleTimeString()}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">Jogos disponíveis</div>
                      <div className="text-sm text-muted-foreground">
                        {account.games?.length || 0} jogos
                      </div>
                    </div>
                    <Button asChild>
                      <Link to={`/accounts/${account.id}`}>
                        Ver Detalhes
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-muted/20">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Este membro não está utilizando nenhuma conta no momento.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MemberActiveAccounts;
