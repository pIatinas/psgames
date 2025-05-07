import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
import { members, accounts } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Mail, Gamepad2, Check, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MemberDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Encontrar o membro pelo ID
  const member = members.find(member => member.id === id);
  
  // Encontrar contas que este membro está utilizando
  const activeAccounts = accounts.filter(account => 
    (account.slot1 && account.slot1.member.id === id && !account.slot1.left_at) ||
    (account.slot2 && account.slot2.member.id === id && !account.slot2.left_at)
  );
  
  // Se o membro não for encontrado
  if (!member) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow container py-16 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Membro não encontrado</h2>
          <p className="text-muted-foreground mb-6">
            Não foi possível encontrar o membro solicitado.
          </p>
          <Button asChild>
            <Link to="/members">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para membros
            </Link>
          </Button>
        </main>
        
        <Footer />
      </div>
    );
  }

  // Obter as iniciais do nome
  const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  // Verificar status atual de pagamento
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentPayment = member.payments.find(p => p.month === currentMonth && p.year === currentYear);
  const paymentStatus = currentPayment ? currentPayment.status : 'pending';

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
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Avatar className="w-32 h-32 border-4 border-accent/30">
                  <AvatarImage src={member.profile_image} alt={member.name} />
                  <AvatarFallback className="bg-accent/20 text-accent text-4xl">{initials}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">{member.name}</h1>
                  
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    <Badge className={member.isApproved ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'}>
                      {member.isApproved ? 'Aprovado' : 'Pendente'}
                    </Badge>
                    
                    <Badge className={paymentStatus === 'paid' ? 'bg-secondary hover:bg-secondary/90' : 'bg-destructive hover:bg-destructive/90'}>
                      {paymentStatus === 'paid' ? 'Mensalidade Paga' : 'Mensalidade Pendente'}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center md:justify-start">
                      <Mail className="h-4 w-4 mr-1" />
                      <span>{member.email}</span>
                    </div>
                    
                    <div className="flex items-center justify-center md:justify-start">
                      <Gamepad2 className="h-4 w-4 mr-1" />
                      <span>PSN ID: {member.psn_id}</span>
                    </div>
                    
                    <div className="flex items-center justify-center md:justify-start">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Membro desde {new Date(member.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contas ativas */}
              <div>
                <SectionTitle 
                  title="Contas em Uso" 
                  subtitle={
                    activeAccounts.length > 0
                      ? `${activeAccounts.length} ${activeAccounts.length === 1 ? 'conta ativa' : 'contas ativas'}`
                      : "Nenhuma conta em uso no momento"
                  }
                />
                
                {activeAccounts.length > 0 ? (
                  <div className="space-y-4">
                    {activeAccounts.map(account => {
                      // Determinar qual slot este membro está usando
                      const slotNumber = 
                        (account.slot1 && account.slot1.member.id === id) ? 1 :
                        (account.slot2 && account.slot2.member.id === id) ? 2 : null;
                      
                      // Obter o timestamp de quando o membro entrou
                      const enteredAt = slotNumber === 1 ? account.slot1?.entered_at : account.slot2?.entered_at;
                      
                      return (
                        <Card key={account.id} className="overflow-hidden">
                          <CardHeader className="bg-muted/30 pb-4">
                            <CardTitle className="flex items-center justify-between">
                              {account.name}
                              <Badge>Slot {slotNumber}</Badge>
                            </CardTitle>
                            <CardDescription>
                              {enteredAt && `Em uso desde ${new Date(enteredAt).toLocaleTimeString()}`}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="py-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-sm font-medium">Jogos disponíveis</div>
                                <div className="text-sm text-muted-foreground">
                                  {account.games?.length || 0} jogos
                                </div>
                              </div>
                              <Button asChild>
                                <Link to={`/accounts/${account.id}`}>
                                  Ver Detalhes
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card className="bg-muted/20">
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground">
                        Este membro não está utilizando nenhuma conta no momento.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            
            {/* Barra lateral */}
            <div>
              {/* Histórico de pagamentos */}
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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MemberDetail;
