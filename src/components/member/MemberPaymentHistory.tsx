import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Member } from '@/types';
import { ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { memberPaymentService } from '@/services/memberPaymentService';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
interface MemberPaymentHistoryProps {
  member: Member;
}
const MemberPaymentHistory: React.FC<MemberPaymentHistoryProps> = ({
  member
}) => {
  const {
    currentUser
  } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const handleStatusChange = async (month: number, year: number, status: string) => {
    try {
      await memberPaymentService.upsertPayment({
        member_id: member.id,
        month,
        year,
        status: status as 'paid' | 'pending' | 'overdue',
        amount: 0,
        paid_at: status === 'paid' ? new Date().toISOString() : undefined
      });
      toast({
        title: "Status atualizado",
        description: "O status do pagamento foi atualizado com sucesso."
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ['member-payments', member.id]
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-members']
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do pagamento.",
        variant: "destructive"
      });
    }
  };
  // Generate payment history for the last 12 months, grouped by year
  const generatePaymentHistory = () => {
    const history = [];
    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      // Check if payment exists for this month
      const payment = member.payments?.find(p => p.month === month && p.year === year);
      history.push({
        month,
        year,
        status: payment?.status || 'pending',
        amount: payment?.amount || 0,
        paid_at: payment?.paid_at,
        monthName: date.toLocaleDateString('pt-BR', {
          month: 'long'
        })
      });
    }

    // Group by year, most recent first
    const groupedByYear = history.reduce((groups, payment) => {
      const year = payment.year;
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(payment);
      return groups;
    }, {} as Record<number, typeof history>);

    // Sort years in descending order and months within each year
    return Object.keys(groupedByYear).map(Number).sort((a, b) => b - a).map(year => ({
      year,
      payments: groupedByYear[year].sort((a, b) => b.month - a.month)
    }));
  };
  const paymentHistory = generatePaymentHistory();
  return <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full h-auto p-2 text-center bg-pink-600 hover:bg-pink-700 text-white block mt-5">
          Ver Histórico
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Histórico de Pagamentos</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-96">
          <div className="space-y-6">
            {paymentHistory.map(yearGroup => <div key={yearGroup.year}>
                <h3 className="font-bold text-lg mb-3">{yearGroup.year}</h3>
                <div className="space-y-3">
                  {yearGroup.payments.map((payment, index) => <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm capitalize">{payment.monthName}</p>
                        {payment.paid_at && <p className="text-xs text-muted-foreground">
                            Pago em {new Date(payment.paid_at).toLocaleDateString('pt-BR')}
                          </p>}
                      </div>
                      <div className="flex items-center gap-2">
                        {isAdmin ? <Select defaultValue={payment.status} onValueChange={value => handleStatusChange(payment.month, payment.year, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="paid">Pago</SelectItem>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="overdue">Atrasado</SelectItem>
                            </SelectContent>
                          </Select> : <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                            {payment.status === 'paid' ? 'Pago' : payment.status === 'overdue' ? 'Atrasado' : 'Pendente'}
                          </Badge>}
                      </div>
                    </div>)}
                </div>
              </div>)}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>;
};
export default MemberPaymentHistory;