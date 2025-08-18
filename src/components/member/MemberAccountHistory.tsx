import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { generateAccountSlug } from '@/utils/gameUtils';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { accountUsageService } from '@/services/accountUsageService';

interface MemberAccountHistoryProps {
  memberId: string;
}

const MemberAccountHistory: React.FC<MemberAccountHistoryProps> = ({ memberId }) => {
  const { data: usageHistory = [], isLoading } = useQuery({
    queryKey: ['member-usage-history', memberId],
    queryFn: () => accountUsageService.getByMember(memberId)
  });

  // Filter to show only deactivated accounts to avoid duplication with active accounts
  const completedUsage = usageHistory.filter(usage => usage.deactivated_at);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contas <span>Utilizadas</span></CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground opacity-60">Carregando histórico...</p>
        </CardContent>
      </Card>
    );
  }

  if (completedUsage.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contas <span>Utilizadas</span></CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground opacity-60">Nenhuma conta utilizada ainda.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contas <span>Utilizadas</span></CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {completedUsage.map(usage => {
          const account = (usage as any).accounts;
          const activatedDate = new Date(usage.activated_at);
          const deactivatedDate = usage.deactivated_at ? new Date(usage.deactivated_at) : null;
          const daysUsed = deactivatedDate ? differenceInDays(deactivatedDate, activatedDate) : 0;

          return (
            <div key={usage.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Link 
                  to={`/accounts/${generateAccountSlug(account.id, account.email)}`} 
                  className="font-medium text-sm hover:underline"
                >
                  {account.email.split('@')[0]}
                </Link>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    Slot {usage.slot_number}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {account.games?.length || 0} jogos
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {daysUsed} {daysUsed === 1 ? 'dia' : 'dias'}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1 space-y-1">
                  <p>
                    Ativou: {formatDistanceToNow(activatedDate, {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </p>
                  {deactivatedDate && (
                    <p>
                      Desativou: {formatDistanceToNow(deactivatedDate, {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </p>
                  )}
                </div>
              </div>
              
              <Badge variant="secondary" className="text-xs">
                Concluído
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default MemberAccountHistory;