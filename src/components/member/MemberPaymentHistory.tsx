import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Member } from '@/types';
import { ExternalLink } from 'lucide-react';

interface MemberPaymentHistoryProps {
  member: Member;
}

const MemberPaymentHistory: React.FC<MemberPaymentHistoryProps> = ({ member }) => {
  // Generate payment history for the last 12 months
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
        amount: payment?.amount || 25,
        paid_at: payment?.paid_at,
        monthName: date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      });
    }
    
    return history.reverse(); // Most recent first
  };

  const paymentHistory = generatePaymentHistory();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-auto p-0 text-left justify-start">
          <div className="space-y-1">
            <div className="text-sm font-medium">Mensalidade</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              R$ 25,00/mês
              <ExternalLink className="h-3 w-3" />
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Histórico de Pagamentos</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {paymentHistory.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm capitalize">{payment.monthName}</p>
                  <p className="text-xs text-muted-foreground">
                    R$ {payment.amount.toFixed(2)}
                  </p>
                  {payment.paid_at && (
                    <p className="text-xs text-muted-foreground">
                      Pago em {new Date(payment.paid_at).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
                <Badge 
                  variant={payment.status === 'paid' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MemberPaymentHistory;