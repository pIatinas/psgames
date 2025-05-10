
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
import { useAuth } from '@/hooks/useAuth';

interface MemberPaymentSidebarProps {
  member: Member;
}

const MemberPaymentSidebar: React.FC<MemberPaymentSidebarProps> = ({ member }) => {
  const { currentUser } = useAuth();
  // Verificar status atual de pagamento
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentPayment = member.payments.find(p => p.month === currentMonth && p.year === currentYear);
  const paymentStatus = currentPayment ? currentPayment.status : 'pending';
  
  // Valor fixo da mensalidade
  const monthlyFee = 60; // R$ 60,00

  return (
    <Card className="glass-card sticky top-20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
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
        <div className="mb-4 p-3 rounded-md bg-muted flex items-center justify-between">
          <span className="font-medium text-foreground">Valor da mensalidade</span>
          <Badge variant="outline" className="text-foreground">
            R$ {monthlyFee.toFixed(2)}
          </Badge>
        </div>
        
        {member.payments.length > 0 ? (
          <div className="space-y-3">
            {member.payments.map(payment => (
              <div 
                key={payment.id} 
                className="flex justify-between items-center py-2 border-b border-border/30 last:border-0"
              >
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {new Date(payment.year, payment.month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Pago em: {new Date(payment.paid_at).toLocaleDateString()}
                  </div>
                </div>
                <Badge className={`${payment.status === 'paid' ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'}`}>
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
        {currentUser?.role === 'admin' ? (
          <Button 
            disabled={paymentStatus === 'paid'} 
            className="w-full"
          >
            {paymentStatus === 'paid' ? 'Mensalidade Atual Paga' : 'Marcar como Pago'}
          </Button>
        ) : (
          <div className="text-sm text-center text-muted-foreground">
            Valor mensal: R$ {monthlyFee.toFixed(2)}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default MemberPaymentSidebar;
