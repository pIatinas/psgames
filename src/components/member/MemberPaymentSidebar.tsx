
import React from 'react';
import { Member } from '@/types';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface MemberPaymentSidebarProps {
  member: Member;
}

const MemberPaymentSidebar: React.FC<MemberPaymentSidebarProps> = ({ member }) => {
  // Verificar status atual de pagamento
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentPayment = member.payments.find(p => p.month === currentMonth && p.year === currentYear);
  const paymentStatus = currentPayment ? currentPayment.status : 'pending';

  return (
    <Card className="glass-card sticky top-20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Histórico de Pagamentos</span>
          {paymentStatus === 'paid' && (
            <Check className="h-5 w-5 text-green-500" />
          )}
          {paymentStatus === 'pending' && (
            <X className="h-5 w-5 text-destructive" />
          )}
        </CardTitle>
        <CardDescription>
          Status da mensalidade e histórico de pagamentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {member.payments.length > 0 ? (
          <div className="space-y-3">
            {member.payments.map(payment => (
              <div 
                key={payment.id} 
                className="flex justify-between items-center py-2 border-b border-border/30 last:border-0"
              >
                <div>
                  <div className="text-sm font-medium">
                    {new Date(payment.year, payment.month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Pago em: {new Date(payment.paid_at).toLocaleDateString()}
                  </div>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">
                  R$ {payment.amount.toFixed(2)}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            Nenhum pagamento registrado.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Button 
          disabled={paymentStatus === 'paid'} 
          className="w-full"
        >
          {paymentStatus === 'paid' ? 'Mensalidade Atual Paga' : 'Marcar como Pago'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MemberPaymentSidebar;
