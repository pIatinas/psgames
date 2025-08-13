import React from 'react';
import { Users, Lock, CheckCircle } from 'lucide-react';
import { Account } from '@/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { accountService } from '@/services/supabaseService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AccountSidebarProps {
  account: Account;
  onAccountUpdate?: (updatedAccount: Account) => void;
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({ 
  account, 
  onAccountUpdate 
}) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [openDialog, setOpenDialog] = React.useState(false);
  
  const isLoggedIn = !!currentUser;
  const currentMemberId = currentUser?.id;
  
  // Verificar se o membro atual está usando um slot nesta conta
  const isUsingSlot = account.slots?.some(slot => slot.user_id === currentMemberId);
  
  // Verificar se há slots disponíveis
  const usedSlots = account.slots?.length || 0;
  const hasAvailableSlot = usedSlots < 2;
  
  const isSlotOccupied = (slotNumber: number) => {
    return account.slots?.find(slot => slot.slot_number === slotNumber) !== undefined;
  };
  
  const handleUseAccount = async () => {
    if (!isLoggedIn || !currentUser) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para usar uma conta.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Find the first available slot (1 or 2)
      const availableSlot = !isSlotOccupied(1) ? 1 : (!isSlotOccupied(2) ? 2 : null);
      
      if (!availableSlot) {
        toast({
          title: "Erro",
          description: "Não há slots disponíveis nesta conta.",
          variant: "destructive",
        });
        return;
      }
      
      try {
        const success = await accountService.assignSlot(account.id, availableSlot as 1 | 2, currentUser.id);
        
        if (success) {
          // Reload account data to show updated slots
          const updatedAccount = await accountService.getById(account.id);
          if (updatedAccount && onAccountUpdate) {
            onAccountUpdate(updatedAccount);
          }
          
          setOpenDialog(true); // Open credentials dialog
          toast({
            title: "Conta ativada",
            description: "Você agora está utilizando esta conta."
          });
        }
      } catch (error: any) {
        toast({
          title: "Erro",
          description: error.message || "Não foi possível ativar a conta.",
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
    }
  };
  
  const handleReleaseAccount = async () => {
    if (!isLoggedIn || !currentUser) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para devolver uma conta.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const userSlot = account.slots?.find(slot => slot.user_id === currentUser.id);
      if (userSlot) {
        const success = await accountService.freeSlot(account.id, userSlot.slot_number);
        if (success) {
          // Reload account data to show updated slots
          const updatedAccount = await accountService.getById(account.id);
          if (updatedAccount && onAccountUpdate) {
            onAccountUpdate(updatedAccount);
          }
          toast({
            title: "Conta devolvida",
            description: "Você devolveu a conta com sucesso."
          });
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
    }
  };

  return (
    <>
      <div className="glass-card rounded-lg p-6 sticky top-20 space-y-6">
        <div className="flex items-center justify-center">
          <div className="w-32 h-32 p-2 rounded-lg neon-blue-border bg-secondary/10">
            <img 
              src={account.qr_code} 
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
                {2 - usedSlots} slots disponíveis
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
              {account.security_answer && (
                <div>
                  <div className="font-medium">Resposta de Segurança</div>
                  <div className="p-2 bg-muted rounded-md">{account.security_answer}</div>
                </div>
              )}
              {account.codes && (
                <div>
                  <div className="font-medium">Código de Acesso</div>
                  <div className="p-2 bg-muted rounded-md">{account.codes}</div>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            Não compartilhe estas credenciais com ninguém.
            Uma vez que você terminar de usar a conta, clique em "Devolver Conta".
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountSidebar;