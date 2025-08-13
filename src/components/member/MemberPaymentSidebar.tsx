import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Clock } from 'lucide-react';
import { Member } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import MemberPaymentHistory from './MemberPaymentHistory';
interface MemberPaymentSidebarProps {
  member: Member;
}
const MemberPaymentSidebar: React.FC<MemberPaymentSidebarProps> = ({
  member
}) => {
  const {
    currentUser
  } = useAuth();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const currentMonthPayment = member.payments?.find(payment => payment.month === currentMonth && payment.year === currentYear);
  const isCurrentMonthPaid = currentMonthPayment?.status === 'paid';
  const isAdmin = currentUser?.role === 'admin';
  const handleMarkAsPaid = async () => {
    // TODO: Implement payment marking logic
    console.log('Mark payment as paid for member:', member.id);
  };
  // Generate payment history for the last 6 months
  const generatePaymentHistory = () => {
    const history = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      
      // Check if payment exists for this month
      const payment = member.payments?.find(p => p.month === month && p.year === year);
      
      // Determine status based on payment and date
      let status = 'pending';
      if (payment?.status === 'paid') {
        status = 'paid';
      } else if (date < new Date()) {
        status = 'overdue';
      }
      
      history.push({
        month,
        year,
        status,
        amount: payment?.amount || 25,
        paid_at: payment?.paid_at,
        monthName: date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      });
    }
    
    return history.reverse(); // Most recent first
  };

  const paymentHistory = generatePaymentHistory();

  return <Card>
      <CardHeader>
        <CardTitle>Pagamentos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment History for last 6 months */}
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
              <div className="flex items-center gap-2">
                {payment.status === 'paid' ? (
                  <div className="flex items-center gap-1 text-green-500">
                    <Check className="h-3 w-3" />
                    <span className="text-xs">Pago</span>
                  </div>
                ) : payment.status === 'overdue' ? (
                  <div className="flex items-center gap-1 text-red-500">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">Atrasado</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-orange-500">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">Pendente</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Ver Histórico Button */}
        <div className="p-3 rounded-md bg-muted">
          <MemberPaymentHistory member={member} />
        </div>

        {/* Admin Action */}
        {isAdmin && !isCurrentMonthPaid && <Button onClick={handleMarkAsPaid} className="w-full" size="sm">
            Marcar como Pago
          </Button>}
      </CardContent>
    </Card>;
};
export default MemberPaymentSidebar;