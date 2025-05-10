
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { accounts } from '@/data/mockData';
import AccountNotFound from '@/components/account/AccountNotFound';
import AccountDetailsCard from '@/components/account/AccountDetailsCard';
import AccountGamesList from '@/components/account/AccountGamesList';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { CheckCircle } from 'lucide-react';

const AccountDetail = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [openCredentialsDialog, setOpenCredentialsDialog] = useState(false);
  
  // Encontrar a conta pelo ID
  const account = accounts.find(account => account.id === id);
  
  // Se a conta não for encontrada
  if (!account) {
    return <AccountNotFound />;
  }

  // Verificar se o membro atual está usando um slot nesta conta
  const isUsingSlot = currentUser?.member && (
    (account.slot1 && account.slot1.member.id === currentUser.member.id) || 
    (account.slot2 && account.slot2.member.id === currentUser.member.id)
  );
  
  // Verificar se há slots disponíveis
  const availableSlots = 2 - 
    (account.slot1 ? 1 : 0) - 
    (account.slot2 ? 1 : 0);
  const hasAvailableSlot = availableSlots > 0;
  
  const handleUseAccount = () => {
    if (!currentUser || !currentUser.member) {
      toast({
        title: "Login necessário",
        description: "Você precisa fazer login para utilizar esta conta",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    // Find first available slot
    const slotNumber = !account.slot1 ? 1 : !account.slot2 ? 2 : 0;
    
    if (slotNumber && currentUser.member) {
      // Update account with new slot
      if (slotNumber === 1) {
        account.slot1 = {
          member: currentUser.member,
          entered_at: new Date()
        };
      } else {
        account.slot2 = {
          member: currentUser.member,
          entered_at: new Date()
        };
      }
      
      // Show credentials dialog
      setOpenCredentialsDialog(true);
      
      toast({
        title: "Conta ativada",
        description: "Você agora está utilizando esta conta.",
      });
    }
  };
  
  const handleReleaseAccount = () => {
    if (currentUser?.member) {
      // Remove member from slot
      if (account.slot1 && account.slot1.member.id === currentUser.member.id) {
        account.slot1 = undefined;
      }
      if (account.slot2 && account.slot2.member.id === currentUser.member.id) {
        account.slot2 = undefined;
      }
      
      toast({
        title: "Conta devolvida",
        description: "Você devolveu a conta com sucesso.",
      });
    }
  };
  
  const getSlotUsers = () => {
    const users = [];
    if (account.slot1) {
      users.push(account.slot1.member.name);
    }
    if (account.slot2) {
      users.push(account.slot2.member.name);
    }
    return users.join(', ');
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
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Jogos da conta */}
              <AccountGamesList games={account.games} />
            </div>
            
            {/* Barra lateral */}
            <div>
              <div className="rounded-lg p-6 sticky top-20 bg-gray-800/10 border border-gray-800/20 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Status da Conta</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-3 rounded-lg ${!account.slot1 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        <div className="text-lg font-bold">Slot 1</div>
                        <div className="text-sm">{account.slot1 ? account.slot1.member.name : 'Disponível'}</div>
                      </div>
                      <div className={`p-3 rounded-lg ${!account.slot2 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        <div className="text-lg font-bold">Slot 2</div>
                        <div className="text-sm">{account.slot2 ? account.slot2.member.name : 'Disponível'}</div>
                      </div>
                    </div>
                    
                    {(account.slot1 || account.slot2) && (
                      <div>
                        <div className="text-sm font-medium text-foreground">Em uso por:</div>
                        <div className="text-sm">{getSlotUsers()}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                {isUsingSlot ? (
                  <Button 
                    size="lg" 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleReleaseAccount}
                  >
                    Devolver
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="w-full" 
                    onClick={handleUseAccount}
                    disabled={!hasAvailableSlot || !currentUser}
                  >
                    {!currentUser ? 'Entre para utilizar' : hasAvailableSlot ? 'Utilizar' : 'Sem Slots Disponíveis'}
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
      <Dialog open={openCredentialsDialog} onOpenChange={setOpenCredentialsDialog}>
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
            Uma vez que você terminar de usar a conta, clique em "Devolver".
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountDetail;
