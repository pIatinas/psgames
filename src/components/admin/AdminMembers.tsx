
import React from 'react';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useMemberManagement } from '@/hooks/useMemberManagement';
import MembersList from './members/MembersList';
import MemberForm from './members/MemberForm';

const AdminMembers: React.FC = () => {
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

  return (
    <div>
      <div className="flex justify-end mb-6">
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
