
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useMemberManagement } from '@/hooks/useMemberManagement';
import MembersList from './members/MembersList';
import MemberForm from './members/MemberForm';

const AdminMembers: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    members,
    accounts,
    newMember,
    setNewMember,
    selectedAccounts,
    setSelectedAccounts,
    isEditing,
    setIsEditing,
    open,
    setOpen,
    handleAccountToggle,
    handleSaveMember,
    handleEditMember,
    handleDeleteMember,
  } = useMemberManagement();

  // Redirect if not admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para acessar esta área.",
        variant: "destructive",
      });
      navigate('/');
    } else if (!currentUser) {
      toast({
        title: "Login Necessário",
        description: "Faça login para acessar esta área.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [currentUser, navigate, toast]);

  // Return null if not authenticated or loading
  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gerenciar Membros</h2>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Membro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar Membro' : 'Adicionar Novo Membro'}</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do membro abaixo.
              </DialogDescription>
            </DialogHeader>
            
            <MemberForm
              newMember={newMember}
              setNewMember={setNewMember}
              selectedAccounts={selectedAccounts}
              setSelectedAccounts={setSelectedAccounts}
              accounts={accounts}
              handleAccountToggle={handleAccountToggle}
              handleSaveMember={handleSaveMember}
              isEditing={isEditing}
              setOpen={setOpen}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <MembersList
        members={members}
        accounts={accounts}
        handleEditMember={handleEditMember}
        handleDeleteMember={handleDeleteMember}
      />
    </div>
  );
};

export default AdminMembers;
