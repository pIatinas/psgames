import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { memberPaymentService, MemberPayment } from '@/services/memberPaymentService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

interface MemberPaymentManagerProps {
  memberId: string;
}

const MemberPaymentManager: React.FC<MemberPaymentManagerProps> = ({ memberId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loadingPayments, setLoadingPayments] = useState<string>('');

  const { data: payments = [] } = useQuery({
    queryKey: ['member-payments', memberId],
    queryFn: () => memberPaymentService.getByMember(memberId)
  });

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];
  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  const getPaymentForMonth = (year: number, month: number) => {
    return payments.find(p => p.year === year && p.month === month);
  };

  const updatePaymentStatus = async (year: number, month: number, status: 'paid' | 'pending' | 'overdue') => {
    const paymentKey = `${year}-${month}`;
    setLoadingPayments(paymentKey);
    
    try {
      await memberPaymentService.upsertPayment({
        member_id: memberId,
        year,
        month,
        status,
        amount: 0,
        paid_at: status === 'paid' ? new Date().toISOString() : undefined
      });

      queryClient.invalidateQueries({ queryKey: ['member-payments', memberId] });
      
      toast({
        title: "Pagamento atualizado",
        description: `Status do pagamento de ${months[month - 1].label}/${year} atualizado para ${status === 'paid' ? 'pago' : status === 'pending' ? 'pendente' : 'atrasado'}.`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o pagamento.",
        variant: "destructive"
      });
    } finally {
      setLoadingPayments('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'overdue': return 'Atrasado';
      default: return 'Não definido';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestão de Pagamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {years.map(year => (
            <div key={year} className="space-y-2">
              <h4 className="font-medium">{year}</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {months.map(month => {
                  const payment = getPaymentForMonth(year, month.value);
                  const paymentKey = `${year}-${month.value}`;
                  const isLoading = loadingPayments === paymentKey;
                  
                  return (
                    <div key={month.value} className="flex flex-col space-y-1">
                      <div className="text-xs font-medium">{month.label}</div>
                      <div className="flex items-center space-x-1">
                        <Badge variant={getStatusColor(payment?.status || 'pending')} className="text-xs">
                          {getStatusLabel(payment?.status || 'pending')}
                        </Badge>
                        {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                      </div>
                      <Select
                        value={payment?.status || 'pending'}
                        onValueChange={(status) => updatePaymentStatus(year, month.value, status as any)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="paid">Pago</SelectItem>
                          <SelectItem value="overdue">Atrasado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberPaymentManager;