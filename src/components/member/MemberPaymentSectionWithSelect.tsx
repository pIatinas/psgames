import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Member } from '@/types';
import { useAuth } from '@/hooks/auth';
import { memberPaymentService } from '@/services/memberPaymentService';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient, useQuery } from '@tanstack/react-query';
interface MemberPaymentSectionWithSelectProps {
  member: Member;
}
const MemberPaymentSectionWithSelect: React.FC<MemberPaymentSectionWithSelectProps> = ({
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

  // Fetch member payments
  const {
    data: memberPayments = []
  } = useQuery({
    queryKey: ['member-payments', member.id],
    queryFn: () => memberPaymentService.getByMember(member.id),
    enabled: !!member.id
  });
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

  // Generate payment history grouped by year
  const generatePaymentHistory = () => {
    const history = [];
    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const payment = memberPayments.find(p => p.month === month && p.year === year);
      history.push({
        month,
        year,
        status: payment?.status || 'pending',
        monthName: date.toLocaleDateString('pt-BR', {
          month: 'long'
        }),
        paid_at: payment?.paid_at
      });
    }

    // Group by year
    const groupedByYear = history.reduce((groups, payment) => {
      const year = payment.year;
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(payment);
      return groups;
    }, {} as Record<number, typeof history>);
    return Object.keys(groupedByYear).map(Number).sort((a, b) => b - a).map(year => ({
      year,
      payments: groupedByYear[year].sort((a, b) => b.month - a.month)
    }));
  };
  const paymentHistory = generatePaymentHistory();
  return <Card>
      <CardHeader>
        <CardTitle>Histórico de <span>Pagamentos</span></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {paymentHistory.map(yearGroup => <div key={yearGroup.year}>
              <h4 className="font-bold text-lg mb-3">{yearGroup.year}</h4>
              <div className="space-y-3 grid grid-cols-2 gap-2">
                {yearGroup.payments.map((payment, index) => <div key={index} className={`flex items-center justify-center border rounded-lg flex-col text-center py-4 px-2 relative ${payment.status === 'paid' ? 'bg-primary/10 border-primary/40' : payment.status === 'overdue' ? 'bg-destructive/10 border-destructive/40' : 'bg-muted/20 border-muted/40'}`}>
                    <div>
                      <p className="font-medium text-sm capitalize">{payment.monthName}</p>
                      {payment.paid_at && <p className="text-xs text-muted-foreground">
                          Pago em {new Date(payment.paid_at).toLocaleDateString('pt-BR')}
                        </p>}
                    </div>
                    <div className="flex items-center gap-2">
                       {isAdmin ? <Select value={payment.status} onValueChange={value => handleStatusChange(payment.month, payment.year, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paid">Pago</SelectItem>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="overdue">Atrasado</SelectItem>
                          </SelectContent>
                        </Select> : <span className={`text-xs px-2 py-1 rounded ${payment.status === 'paid' ? 'bg-green-100 text-green-800' : payment.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {payment.status === 'paid' ? 'Pago' : payment.status === 'overdue' ? 'Atrasado' : 'Pendente'}
                        </span>}
                    </div>
                  </div>)}
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
};
export default MemberPaymentSectionWithSelect;