
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
import { accounts } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, Lock, Users, CheckCircle } from 'lucide-react';
import GameCard from '@/components/GameCard';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AccountDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  
  // Simular um usuário logado (membro #1)
  const currentMemberId = "1";
  
  // Encontrar a conta pelo ID
  const account = accounts.find(account => account.id === id);
  
  // Se a conta não for encontrada
  if (!account) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow container py-16 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Conta não encontrada</h2>
          <p className="text-muted-foreground mb-6">
            Não foi possível encontrar a conta solicitada.
          </p>
          <Button asChild>
            <Link to="/accounts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para contas
            </Link>
          </Button>
        </main>
        
        <Footer />
      </div>
    );
  }

  // Verificar se o membro atual está usando um slot nesta conta
  const isUsingSlot = 
    (account.slot1 && account.slot1.member.id === currentMemberId) || 
    (account.slot2 && account.slot2.member.id === currentMemberId);
  
  // Verificar se há slots disponíveis
  const hasAvailableSlot = !account.slot1 || !account.slot2;
  
  const handleUseAccount = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para usar uma conta.",
        variant: "destructive",
      });
      return;
    }
    
    setOpenDialog(true);
  };
  
  const handleReleaseAccount = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para devolver uma conta.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Conta devolvida",
      description: "Você devolveu a conta com sucesso.",
      variant: "default",
    });
  };

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
              <Link to="/accounts">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
            <SectionTitle 
              title={account.name} 
              className="mb-0"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Informações da conta */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Detalhes da Conta</CardTitle>
                  <CardDescription>Informações não sensíveis sobre esta conta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">Criada em</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(account.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Status dos Slots</div>
                    <div className="flex gap-4 mt-2">
                      <div className={`text-sm px-3 py-1 rounded-md ${account.slot1 ? 'bg-destructive/20 text-destructive' : 'bg-green-500/20 text-green-500'}`}>
                        Slot 1: {account.slot1 ? 'Em uso' : 'Disponível'}
                      </div>
                      <div className={`text-sm px-3 py-1 rounded-md ${account.slot2 ? 'bg-destructive/20 text-destructive' : 'bg-green-500/20 text-green-500'}`}>
                        Slot 2: {account.slot2 ? 'Em uso' : 'Disponível'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Jogos da conta */}
              <div>
                <SectionTitle 
                  title="Jogos nesta Conta" 
                  subtitle={`${account.games?.length || 0} jogos disponíveis`}
                />
                
                {account.games && account.games.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {account.games.map(game => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Esta conta não possui jogos cadastrados.
                  </p>
                )}
              </div>
            </div>
            
            {/* Barra lateral */}
            <div>
              <div className="glass-card rounded-lg p-6 sticky top-20 space-y-6">
                <div className="flex items-center justify-center">
                  <div className="w-32 h-32 p-2 rounded-lg neon-blue-border bg-secondary/10">
                    <img 
                      src={account.qrcode} 
                      alt="QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-secondary" />
                    <div>
                      <h3 className="font-semibold">
                        {2 - (account.slot1 ? 1 : 0) - (account.slot2 ? 1 : 0)} slots disponíveis
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-secondary" />
                    <div>
                      <h3 className="font-semibold">Acesso seguro</h3>
                    </div>
                  </div>
                </div>
                
                {isUsingSlot ? (
                  <Button 
                    size="lg" 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleReleaseAccount}
                  >
                    Devolver Conta
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="w-full bg-secondary hover:bg-secondary/90" 
                    onClick={handleUseAccount}
                    disabled={!hasAvailableSlot}
                  >
                    {hasAvailableSlot ? 'Utilizar Conta' : 'Sem Slots Disponíveis'}
                  </Button>
                )}
                
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  Para utilizar esta conta, você deve ser um membro aprovado.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Dialog para mostrar credenciais de acesso */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Credenciais de Acesso</DialogTitle>
            <DialogDescription>
              Você pode utilizar estas credenciais para acessar a conta.
              Lembre-se de devolver a conta quando terminar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <div className="p-2 rounded-full bg-green-500/20 text-green-500">
                <CheckCircle className="h-12 w-12" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="font-medium">Email</div>
                <div className="p-2 bg-muted rounded-md">{account.email}</div>
              </div>
              <div>
                <div className="font-medium">Senha</div>
                <div className="p-2 bg-muted rounded-md">{account.password}</div>
              </div>
              <div>
                <div className="font-medium">Código de Acesso</div>
                <div className="p-2 bg-muted rounded-md">{account.code}</div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            Não compartilhe estas credenciais com ninguém.
            Uma vez que você terminar de usar a conta, clique em "Devolver Conta".
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountDetail;
