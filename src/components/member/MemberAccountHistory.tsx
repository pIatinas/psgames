import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Account } from '@/types';
import { Link } from 'react-router-dom';
import { generateAccountSlug } from '@/utils/gameUtils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
interface MemberAccountHistoryProps {
  accounts: Account[];
  memberId: string;
}
const MemberAccountHistory: React.FC<MemberAccountHistoryProps> = ({
  accounts,
  memberId
}) => {
  // Get all accounts this member has ever used
  const memberAccountHistory = accounts.filter(account => account.slots?.some(slot => slot.user_id === memberId)).map(account => {
    const memberSlots = account.slots?.filter(slot => slot.user_id === memberId) || [];
    const latestSlot = memberSlots.sort((a, b) => new Date(b.entered_at || 0).getTime() - new Date(a.entered_at || 0).getTime())[0];
    return {
      ...account,
      latestActivation: latestSlot?.entered_at || '',
      slotNumber: latestSlot?.slot_number || 1,
      isCurrentlyActive: !!latestSlot?.user_id
    };
  }).sort((a, b) => new Date(b.latestActivation).getTime() - new Date(a.latestActivation).getTime());
  if (memberAccountHistory.length === 0) {
    return <Card>
        <CardHeader>
          <CardTitle>Contas Utilizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground opacity-60 ">Nenhuma conta utilizada ainda.</p>
        </CardContent>
      </Card>;
  }
  return <Card>
      <CardHeader>
        <CardTitle>Contas Utilizadas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {memberAccountHistory.map(account => <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <Link to={`/accounts/${generateAccountSlug(account.id, account.email)}`} className="font-medium text-sm hover:underline">
                {account.email.split('@')[0]}
              </Link>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  Slot {account.slotNumber}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {account.games?.length || 0} jogos
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Último acesso: {formatDistanceToNow(new Date(account.latestActivation), {
              addSuffix: true,
              locale: ptBR
            })}
              </p>
            </div>
            
            <Badge variant={account.isCurrentlyActive ? "default" : "secondary"} className="text-xs">
              {account.isCurrentlyActive ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>)}
      </CardContent>
    </Card>;
};
export default MemberAccountHistory;