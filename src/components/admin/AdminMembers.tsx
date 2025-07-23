
import React from 'react';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { userService, accountService } from '@/services/supabaseService';
import { useQuery } from '@tanstack/react-query';
import MembersList from './members/MembersList';

const AdminMembers: React.FC = () => {
  const { toast } = useToast();

  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ['admin-members'],
    queryFn: () => userService.getAll(),
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ['admin-accounts'],
    queryFn: () => accountService.getAll(),
  });

  // Transform users to members format for compatibility
  const transformedMembers = members.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email || '',
    password: '', // Not available from users
    psn_id: '', // Not available from users  
    profile_image: user.profile?.avatar_url || '',
    isApproved: true, // Assume approved if they exist
    created_at: user.profile?.created_at || '',
    updated_at: user.profile?.updated_at || '',
  }));

  const handleEditMember = (member: any) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A edição de membros estará disponível em breve.",
    });
  };

  const handleDeleteMember = (id: string) => {
    toast({
      title: "Funcionalidade em desenvolvimento", 
      description: "A exclusão de membros estará disponível em breve.",
    });
  };

  if (membersLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Carregando membros...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Gerenciar Membros</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Membro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Membro</DialogTitle>
              <DialogDescription>
                Funcionalidade em desenvolvimento. Em breve você poderá adicionar novos membros.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      
      <MembersList
        members={transformedMembers}
        accounts={accounts}
        handleEditMember={handleEditMember}
        handleDeleteMember={handleDeleteMember}
      />
    </div>
  );
};

export default AdminMembers;
