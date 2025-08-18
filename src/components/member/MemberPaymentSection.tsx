import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Member } from '@/types';
import MemberPaymentHistory from './MemberPaymentHistory';

interface MemberPaymentSectionProps {
  member: Member;
}

const MemberPaymentSection: React.FC<MemberPaymentSectionProps> = ({ member }) => {
  // Generate payment history grouped by year
  const generatePaymentHistory = () => {
    const history = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      
      const payment = member.payments?.find(p => p.month === month && p.year === year);
      
      history.push({
        month,
        year,
        status: payment?.status || 'pending',
        monthName: date.toLocaleDateString('pt-BR', { month: 'long' })
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

    return Object.keys(groupedByYear)
      .map(Number)
      .sort((a, b) => b - a)
      .map(year => ({
        year,
        payments: groupedByYear[year].sort((a, b) => b.month - a.month)
      }));
  };

  const paymentHistory = generatePaymentHistory();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pagamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentHistory.map((yearGroup) => (
            <div key={yearGroup.year}>
              <h4 className="font-bold text-lg mb-2 text-white">{yearGroup.year}</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {yearGroup.payments.map((payment, index) => (
                  <div key={index} className="text-center p-2 border rounded">
                    <p className="text-xs capitalize">{payment.monthName}</p>
                    <Badge 
                      variant={payment.status === 'paid' ? 'default' : (payment.status as string) === 'overdue' ? 'destructive' : 'secondary'}
                      className="text-xs mt-1"
                    >
                      {payment.status === 'paid' ? 'Pago' : (payment.status as string) === 'overdue' ? 'Atrasado' : 'Pendente'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <MemberPaymentHistory member={member} />
      </CardContent>
    </Card>
  );
};

export default MemberPaymentSection;