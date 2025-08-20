import React from 'react';
import { Account } from '@/types';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
interface AccountUsageTimesProps {
  accounts: Account[];
  memberId: string;
}
const AccountUsageTimes: React.FC<AccountUsageTimesProps> = ({
  accounts,
  memberId
}) => {
  // Get member's active accounts
  const memberAccounts = accounts.filter(account => account.slots?.some(slot => slot.user_id === memberId));

  // Calculate days using the account
  const calculateDaysSince = (date: Date | string) => {
    const now = new Date();
    const enteredDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - enteredDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  return <div className="grid grid-cols-2 gap-4">
      {memberAccounts.map(account => {
      // Find the slot this member is using
      const slot = account.slots?.find(slot => slot.user_id === memberId);
      if (!slot) return null;
      const daysSince = calculateDaysSince(slot.entered_at || new Date());
      return <Card key={account.id} className="mb-4">
            <div className="p-4 flex items-start justify-start flex-col border-b border-border/20">
              <CardTitle className="text-base font-medium">{account.email}</CardTitle>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{daysSince} dia{daysSince !== 1 ? 's' : ''} com a conta</span>
              </div>
            </div>
            <CardContent className="p-3">
              {account.games && account.games.length > 0 ? <div className="flex items-start justify-start">
                  <div className="text-sm font-bols hidden">Jogos</div>
                  <div className="text-sm text-muted-foreground">
                    {account.games.map((game, index) => <div key={game.id} className="mr-1">
                        {game.name} <span className="text-xs bg-secondary/20 text-secondary px-1 rounded hidden">{game.platform.join(', ')}</span>
                      </div>)}
                  </div>
                </div> : <div className="text-sm text-muted-foreground">
                  Não há jogos nessa conta.
                </div>}
            </CardContent>
          </Card>;
    })}
      
      {memberAccounts.length === 0 && <div className="text-muted-foreground opacity-60 ">
          Este membro não está utilizando nenhuma conta no momento.
        </div>}
    </div>;
};
export default AccountUsageTimes;