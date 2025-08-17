import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { accountService } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface SlotManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
  slotNumber: number;
  userName: string;
  userId: string;
}

const SlotManagementModal: React.FC<SlotManagementModalProps> = ({
  isOpen,
  onClose,
  accountId,
  slotNumber,
  userName,
  userId
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeactivating, setIsDeactivating] = useState(false);

  const handleDeactivate = async () => {
    if (isDeactivating) return;
    
    setIsDeactivating(true);
    try {
      const success = await accountService.freeUserSlot(accountId, userId);
      if (success) {
        toast({
          title: "Slot desativado",
          description: `O slot do usuário ${userName} foi desativado com sucesso.`
        });
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['account', accountId] });
        queryClient.invalidateQueries({ queryKey: ['admin-accounts'] });
        queryClient.invalidateQueries({ queryKey: ['admin-members'] });
        
        onClose();
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível desativar o slot.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deactivating slot:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao desativar o slot.",
        variant: "destructive"
      });
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Desativar Slot
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja desativar o Slot {slotNumber} do usuário{' '}
            <span className="font-medium">{userName}</span>?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isDeactivating}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDeactivate}
            disabled={isDeactivating}
          >
            {isDeactivating ? "Desativando..." : "Desativar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SlotManagementModal;