
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { accountService } from '@/services/supabaseService';
import AccountGamesList from '@/components/account/AccountGamesList';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { CheckCircle } from 'lucide-react';
import { parseAccountSlug } from '@/utils/gameUtils';
import { useQuery } from '@tanstack/react-query';

const AccountDetail = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { slug } = useParams<{ slug: string }>();
  const [openCredentialsDialog, setOpenCredentialsDialog] = React.useState(false);
  
  // Extract account ID from slug
  const accountId = slug ? parseAccountSlug(slug) : null;
  
  // Fetch account data
  const { data: account, isLoading } = useQuery({
    queryKey: ['account', accountId],
    queryFn: () => accountId ? accountService.getById(accountId) : null,
    enabled: !!accountId,
  });
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container py-16 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Carregando...</h2>
          <p className="text-white mb-6">Carregando informações da conta...</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!account) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container py-16 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Conta não encontrada</h2>
          <p className="text-white mb-6">Não foi possível encontrar a conta solicitada.</p>
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

  const isUsingSlot = currentUser && account.slots?.some(slot => 
    slot.user_id === currentUser.id
  );
  
  const availableSlots = 2 - (account.slots?.length || 0);
  
  const handleUseSlot = (slotNumber: 1 | 2) => {
    if (!currentUser) {
      toast({
        title: "Login necessário",
        description: "Você precisa fazer login para utilizar esta conta",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    if (!account.slots) {
      account.slots = [];
    }
    
    account.slots.push({
      id: `slot-${Date.now()}`,
      account_id: account.id,
      slot_number: slotNumber,
      user_id: currentUser.id,
      entered_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    });
    
    setOpenCredentialsDialog(true);
    
    toast({
      title: "Conta ativada",
      description: "Você agora está utilizando esta conta.",
    });
  };
  
  const handleReleaseAccount = () => {
    if (currentUser && account.slots) {
      account.slots = account.slots.filter(slot => slot.user_id !== currentUser.id);
      
      toast({
        title: "Conta devolvida",
        description: "Você devolveu a conta com sucesso.",
      });
    }
  };

  const getSlotByNumber = (slotNumber: number) => {
    return account.slots?.find(slot => slot.slot_number === slotNumber);
  };

  const isSlotOccupied = (slotNumber: number) => {
    return getSlotByNumber(slotNumber) !== undefined;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <div className="container py-8">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              className="mr-4 text-white hover:text-foreground"
              asChild
            >
              <Link to="/accounts">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <AccountGamesList games={account.games || []} />
            </div>
            
            <div>
              <div className="rounded-lg p-6 sticky top-20 bg-gray-800/10 border border-gray-800/20 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-white">Status da Conta</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-3 rounded-lg ${!isSlotOccupied(1) ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        <div className="text-lg font-bold">Slot 1</div>
                        <div className="flex items-center justify-center mt-2">
                          {!isSlotOccupied(1) ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <X className="h-5 w-5" />
                          )}
                        </div>
                        <div className="text-sm mt-2">
                          {!isSlotOccupied(1) ? (
                            <Button 
                              size="sm" 
                              onClick={() => handleUseSlot(1)} 
                              disabled={!currentUser}
                              className="w-full"
                            >
                              Utilizar
                            </Button>
                          ) : (
                            'Ocupado'
                          )}
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${!isSlotOccupied(2) ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        <div className="text-lg font-bold">Slot 2</div>
                        <div className="flex items-center justify-center mt-2">
                          {!isSlotOccupied(2) ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <X className="h-5 w-5" />
                          )}
                        </div>
                        <div className="text-sm mt-2">
                          {!isSlotOccupied(2) ? (
                            <Button 
                              size="sm" 
                              onClick={() => handleUseSlot(2)} 
                              disabled={!currentUser}
                              className="w-full"
                            >
                              Utilizar
                            </Button>
                          ) : (
                            'Ocupado'
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {isUsingSlot && (
                  <Button 
                    size="lg" 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleReleaseAccount}
                  >
                    Devolver
                  </Button>
                )}
                
                <div className="mt-4 text-xs text-white text-center">
                  Para utilizar esta conta, você deve ser um membro aprovado.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
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
                <div className="p-2 bg-muted rounded-md">
                  {account.password ? '••••••••' : 'Não definida'}
                </div>
              </div>
              <div>
                <div className="font-medium">Código de Acesso</div>
                <div className="p-2 bg-muted rounded-md">{account.codes}</div>
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
