import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Account, AccountSlot } from '@/types';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
interface AccountActivationsProps {
  account: Account;
}
const AccountActivations: React.FC<AccountActivationsProps> = ({
  account
}) => {
  // Get all historical slot activations sorted by most recent
  // Include ALL slots with entered_at (even those without current user)
  const allActivations = account.slots?.filter(slot => slot.entered_at).sort((a, b) => new Date(b.entered_at!).getTime() - new Date(a.entered_at!).getTime()) || [];
  
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };
  
  const calculateDuration = (enteredAt: string) => {
    const enteredDate = new Date(enteredAt);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - enteredDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays;
  };

  // Group activations by month and year
  const groupedActivations = allActivations.reduce((groups, slot) => {
    const date = new Date(slot.entered_at!);
    const monthYear = format(date, 'MMMM yyyy', { locale: ptBR });
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(slot);
    return groups;
  }, {} as Record<string, typeof allActivations>);

  // Sort months by most recent first
  const sortedGroups = Object.entries(groupedActivations).sort(([a], [b]) => {
    const dateA = new Date(a.split(' ')[1] + '-' + ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'].indexOf(a.split(' ')[0].toLowerCase()) + 1);
    const dateB = new Date(b.split(' ')[1] + '-' + ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'].indexOf(b.split(' ')[0].toLowerCase()) + 1);
    return dateB.getTime() - dateA.getTime();
  });
  if (allActivations.length === 0) {
    return <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Últimas <span>Ativações</span></CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Nenhuma ativação registrada.</p>
        </CardContent>
      </Card>;
  }

  return <Card>
      <CardHeader>
        <CardTitle>Últimas <span>Ativações</span></CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sortedGroups.map(([monthYear, activations]) => (
          <div key={monthYear}>
            <h3 className="font-semibold text-lg mb-4 capitalize">{monthYear}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activations.map((slot, index) => (
                <div key={`${slot.id}-${index}`} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {getInitials(slot.user?.name || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <p className="font-medium text-sm">{slot.user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Slot {slot.slot_number} • Ativado {formatDistanceToNow(new Date(slot.entered_at!), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant={slot.user_id ? "default" : "secondary"} className="text-xs">
                      {slot.user_id ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {calculateDuration(slot.entered_at!)} dias
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>;
};
export default AccountActivations;