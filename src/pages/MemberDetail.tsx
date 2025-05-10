
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { members, accounts } from '@/data/mockData';
import MemberProfileHeader from '@/components/member/MemberProfileHeader';
import MemberNotFound from '@/components/member/MemberNotFound';
import MemberTrophyStats from '@/components/member/MemberTrophyStats';
import AccountUsageTimes from '@/components/member/AccountUsageTimes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MemberDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Encontrar o membro pelo ID
  const member = members.find(member => member.id === id);
  
  // Se o membro não for encontrado
  if (!member) {
    return <MemberNotFound />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <div className="container py-8">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              className="mr-4 text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link to="/members">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Informações do perfil */}
              <MemberProfileHeader member={member} />
              
              {/* Troféus do PSN ID */}
              <MemberTrophyStats psnId={member.psn_id} />
              
              {/* Contas ativas com detalhes de jogos e tempo de uso */}
              <Card>
                <CardHeader>
                  <CardTitle>Contas Ativas</CardTitle>
                  <CardDescription>Contas que este membro está utilizando atualmente</CardDescription>
                </CardHeader>
                <CardContent>
                  <AccountUsageTimes accounts={accounts} memberId={id || ''} />
                </CardContent>
              </Card>
            </div>
            
            {/* Barra lateral */}
            <div>
              {/* Informações do Status do Membro */}
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    Status do Membro
                  </CardTitle>
                  <CardDescription>
                    Informações sobre o status atual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 p-3 rounded-md bg-muted flex items-center justify-between">
                    <span className="font-medium text-foreground">Mensalidade</span>
                    <Badge variant="outline" className="text-foreground">
                      R$ 60,00
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium">Status</div>
                      <div className="text-sm">
                        <Badge className={member.isApproved ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'}>
                          {member.isApproved ? 'Aprovado' : 'Pendente'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium">Mês Atual</div>
                      <div className="text-sm">
                        {(() => {
                          const currentMonth = new Date().getMonth();
                          const currentYear = new Date().getFullYear();
                          const currentPayment = member.payments.find(p => p.month === currentMonth && p.year === currentYear);
                          const paymentStatus = currentPayment ? currentPayment.status : 'pending';
                          
                          return (
                            <Badge className={paymentStatus === 'paid' ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'}>
                              {paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
                            </Badge>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MemberDetail;
