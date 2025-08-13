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
  return <Card>
      <CardHeader>
        <CardTitle>Pagamentos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Monthly Fee */}
        <div className="p-3 rounded-md bg-muted">
          <MemberPaymentHistory member={member} />
        </div>

        {/* Current Month Status */}
        

        {/* Admin Action */}
        {isAdmin && !isCurrentMonthPaid && <Button onClick={handleMarkAsPaid} className="w-full" size="sm">
            Marcar como Pago
          </Button>}

        {/* Payment History */}
        {member.payments && member.payments.length > 0 && <div>
            <div className="text-sm font-medium mb-2">Histórico</div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {member.payments.filter(payment => !(payment.month === currentMonth && payment.year === currentYear)).slice(0, 6).map(payment => <div key={`${payment.month}-${payment.year}`} className="flex items-center justify-between text-xs">
                    <span>
                      {new Date(payment.year, payment.month - 1).toLocaleDateString('pt-BR', {
                month: 'short',
                year: 'numeric'
              })}
                    </span>
                    <div className="flex items-center gap-1">
                      <span>R$ {payment.amount.toFixed(2)}</span>
                      {payment.status === 'paid' ? <Check className="h-3 w-3 text-green-500" /> : <Clock className="h-3 w-3 text-orange-500" />}
                    </div>
                  </div>)}
            </div>
          </div>}
      </CardContent>
    </Card>;
};
export default MemberPaymentSidebar;