
import React from 'react';
import { Link } from 'react-router-dom';
import { Account } from '@/types';
import SectionTitle from '@/components/SectionTitle';
import { CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MemberActiveAccountsProps {
  accounts: Account[];
  memberId: string;
}

const MemberActiveAccounts: React.FC<MemberActiveAccountsProps> = ({ accounts, memberId }) => {
  // Filter accounts where member is using a slot
  const activeAccounts = accounts.filter(account => {
    return account.slots?.some(slot => slot.user_id === memberId);
  });

  // Get slot information for a specific account
  const getMemberSlot = (account: Account) => {
    return account.slots?.find(slot => slot.user_id === memberId);
  };

  return (
    <div>
      <SectionTitle 
        title="Contas Ativas"
        subtitle={`${activeAccounts.length} ${activeAccounts.length === 1 ? 'conta em uso' : 'contas em uso'}`}
      />
      
      {activeAccounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeAccounts.map(account => {
            const slot = getMemberSlot(account);
            const slotNumber = slot?.slot_number || 1;
            const gameCount = account.games?.length || 0;
            
            return (
              <div 
                key={account.id} 
                className="border rounded-lg overflow-hidden flex flex-col"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {account.email.split('@')[0]}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Slot {slotNumber} • {gameCount} {gameCount === 1 ? 'jogo' : 'jogos'}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {new Date(slot?.entered_at || '').toLocaleDateString()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    <CalendarClock className="h-3 w-3 mr-1" />
                    <span>
                      Ativada em {new Date(slot?.entered_at || '').toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="mt-auto p-4 pt-0">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="sm" 
                    asChild
                  >
                    <Link to={`/accounts/${account.id}`}>
                      Ver Detalhes
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 px-4 border rounded-lg">
          <p className="text-muted-foreground">
            Nenhuma conta ativa
          </p>
        </div>
      )}
    </div>
  );
};

export default MemberActiveAccounts;
