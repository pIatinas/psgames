import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { accountService } from '@/services/supabaseService';
import AccountGamesList from '@/components/account/AccountGamesList';
import AccountActivations from '@/components/account/AccountActivations';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle } from 'lucide-react';
import { parseAccountSlug } from '@/utils/gameUtils';
import { useQuery } from '@tanstack/react-query';
import Breadcrumbs from '@/components/Breadcrumbs';
import SlotManagementModal from '@/components/admin/SlotManagementModal';
const AccountDetail = () => {
  const {
    currentUser
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const [openCredentialsDialog, setOpenCredentialsDialog] = React.useState(false);
  const [isActivating, setIsActivating] = React.useState(false);
  const [isReleasing, setIsReleasing] = React.useState(false);
  const [slotManagementModal, setSlotManagementModal] = React.useState<{
    isOpen: boolean;
    accountId: string;
    slotNumber: number;
    userName: string;
    userId: string;
  }>({
    isOpen: false,
    accountId: '',
    slotNumber: 1,
    userName: '',
    userId: ''
  });

  // Extract account ID from slug
  const accountId = slug ? parseAccountSlug(slug) : null;

  // Fetch account data
  const {
    data: account,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['account', accountId],
    queryFn: () => accountId ? accountService.getById(accountId) : null,
    enabled: !!accountId,
    refetchInterval: 5000 // Refetch every 5 seconds to show real-time updates
  });
  if (isLoading) {
    return <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container py-16 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Carregando...</h2>
          <p className="text-white mb-6">Carregando informações da conta...</p>
        </main>
        <Footer />
      </div>;
  }
  if (!account) {
    return <div className="flex flex-col min-h-screen">
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
      </div>;
  }
  const isUsingSlot = currentUser && account.slots?.some(slot => slot.user_id === currentUser.id);
  const availableSlots = 2 - (account.slots?.length || 0);
  const handleUseSlot = async (slotNumber: 1 | 2) => {
    if (!currentUser) {
      toast({
        title: "Login necessário",
        description: "Você precisa fazer login para utilizar esta conta",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    if (isActivating) return;
    setIsActivating(true);
    try {
      const success = await accountService.assignSlot(account.id, slotNumber, currentUser.id);
      if (success) {
        // Reload account data to show updated slots
        const updatedAccount = await accountService.getById(account.id);
        if (updatedAccount) {
          Object.assign(account, updatedAccount);
        }
        setOpenCredentialsDialog(true);
        toast({
          title: "Conta ativada",
          description: "Você agora está utilizando esta conta."
        });
        refetch(); // Refetch to update UI
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível ativar a conta. Tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao ativar conta:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao ativar a conta.",
        variant: "destructive"
      });
    } finally {
      setIsActivating(false);
    }
  };
  const handleReleaseAccount = async () => {
    if (!currentUser || !account.slots) return;
    if (isReleasing) return;
    setIsReleasing(true);
    try {
      const userSlot = account.slots.find(slot => slot.user_id === currentUser.id);
      if (userSlot) {
        const success = await accountService.freeSlot(account.id, userSlot.slot_number);
        if (success) {
          // Reload account data to show updated slots
          const updatedAccount = await accountService.getById(account.id);
          if (updatedAccount) {
            Object.assign(account, updatedAccount);
          }
          toast({
            title: "Conta devolvida",
            description: "Você devolveu a conta com sucesso."
          });
          refetch(); // Refetch to update UI
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível devolver a conta.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Erro ao devolver conta:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao devolver a conta.",
        variant: "destructive"
      });
    } finally {
      setIsReleasing(false);
    }
  };
  const getSlotByNumber = (slotNumber: number) => {
    return account.slots?.find(slot => slot.slot_number === slotNumber);
  };
  const isSlotOccupied = (slotNumber: number) => {
    const slot = getSlotByNumber(slotNumber);
    return slot !== undefined && slot.user_id !== null;
  };
  const getSlotUserName = (slotNumber: number) => {
    const slot = getSlotByNumber(slotNumber);
    return slot?.user?.name || null;
  };
  
  // Check if current user already has a slot in this account
  const userHasSlot = currentUser && account.slots?.some(slot => slot.user_id === currentUser.id);
  const canActivateSlot = (slotNumber: number) => {
    if (!currentUser) return false;
    if (isSlotOccupied(slotNumber)) return false;
    if (userHasSlot) return false; // User can only have one slot per account
    return true;
  };

  const handleSlotClick = (slotNumber: number) => {
    const slot = getSlotByNumber(slotNumber);
    if (slot && slot.user_id && currentUser?.role === 'admin') {
      setSlotManagementModal({
        isOpen: true,
        accountId: account.id,
        slotNumber,
        userName: slot.user?.name || 'Usuário',
        userId: slot.user_id
      });
    }
  };
  return <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground">Início</Link>
              <span className="text-muted-foreground">/</span>
              <Link to="/accounts" className="text-muted-foreground hover:text-foreground">Contas</Link>
              
              
            </nav>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/accounts">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <AccountGamesList games={account.games || []} />
              </div>
            </div>
            
            <div>
              <div className="rounded-lg p-6 sticky top-20 bg-gray-800/10 border border-gray-800/20 space-y-6 mt-16 ">
                <div>
                  <h3 className="font-semibold mb-2 text-white text-2xl">Ativações</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-3 rounded-lg ${!isSlotOccupied(1) ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        <div className="text-lg font-bold text-center">Slot 1</div>
                        <div className="flex items-center justify-center mt-2">
                          {!isSlotOccupied(1) ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                        </div>
                        <div className="text-sm mt-2 text-center">
                          {!isSlotOccupied(1) ? (
                            canActivateSlot(1) ? (
                              <Button size="sm" onClick={() => handleUseSlot(1)} disabled={isActivating} className="w-full">
                                {isActivating ? "Ativando..." : "Utilizar"}
                              </Button>
                            ) : (
                              <span className="text-muted-foreground">Bloqueado</span>
                            )
                          ) : (
                            <span 
                              className={`text-xs ${currentUser?.role === 'admin' ? 'cursor-pointer hover:text-red-400' : ''}`}
                              onClick={() => handleSlotClick(1)}
                            >
                              {getSlotUserName(1)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${!isSlotOccupied(2) ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        <div className="text-lg font-bold text-center">Slot 2</div>
                        <div className="flex items-center justify-center mt-2">
                          {!isSlotOccupied(2) ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                        </div>
                        <div className="text-sm mt-2 text-center">
                          {!isSlotOccupied(2) ? (
                            canActivateSlot(2) ? (
                              <Button size="sm" onClick={() => handleUseSlot(2)} disabled={isActivating} className="w-full">
                                {isActivating ? "Ativando..." : "Utilizar"}
                              </Button>
                            ) : (
                              <span className="text-muted-foreground">Bloqueado</span>
                            )
                          ) : (
                            <span 
                              className={`text-xs ${currentUser?.role === 'admin' ? 'cursor-pointer hover:text-red-400' : ''}`}
                              onClick={() => handleSlotClick(2)}
                            >
                              {getSlotUserName(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {isUsingSlot && <Button size="lg" variant="destructive" className="w-full" onClick={handleReleaseAccount} disabled={isReleasing}>
                    {isReleasing ? "Devolvendo..." : "Devolver"}
                  </Button>}
              </div>
            </div>
          </div>

          {/* Últimas Ativações - Full width outside container grid */}
          <div className="mt-8">
            <AccountActivations account={account} />
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
              {account.qr_code && (
                <div>
                  <div className="font-medium">QR Code</div>
                  <div className="p-2 bg-muted rounded-md flex justify-center">
                    <img src={account.qr_code} alt="QR Code" className="max-w-32 max-h-32" />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            Não compartilhe estas credenciais com ninguém.
            Uma vez que você terminar de usar a conta, clique em "Devolver".
          </div>
        </DialogContent>
      </Dialog>

      {/* Slot Management Modal */}
      <SlotManagementModal
        isOpen={slotManagementModal.isOpen}
        onClose={() => setSlotManagementModal(prev => ({ ...prev, isOpen: false }))}
        accountId={slotManagementModal.accountId}
        slotNumber={slotManagementModal.slotNumber}
        userName={slotManagementModal.userName}
        userId={slotManagementModal.userId}
      />
    </div>;
};
export default AccountDetail;