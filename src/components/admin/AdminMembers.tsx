
import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { userService, accountService } from '@/services/supabaseService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types';
import ImagePlaceholder from '@/components/ui/image-placeholder';

const AdminMembers: React.FC = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar_url: '',
  });

  const { data: members = [], isLoading: membersLoading, refetch } = useQuery({
    queryKey: ['admin-members'],
    queryFn: () => userService.getAll(),
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ['admin-accounts'],
    queryFn: () => accountService.getAll(),
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      avatar_url: '',
    });
    setSelectedAccounts([]);
    setEditingMember(null);
  };

  const handleEdit = (member: User) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      password: '',
      avatar_url: member.profile?.avatar_url || '',
    });
    
    // Encontrar contas selecionadas para este membro
    const memberAccounts = accounts.filter(account => 
      account.slots?.some(slot => slot.user_id === member.id)
    ).map(account => account.id);
    
    setSelectedAccounts(memberAccounts);
    setIsDialogOpen(true);
  };

  const handleAccountToggle = (accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!editingMember && !formData.password) {
      toast({
        title: "Erro",
        description: "Senha é obrigatória para novos usuários.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingMember) {
        // Atualizar usuário existente
        await userService.updateProfile(editingMember.id, {
          name: formData.name,
          avatar_url: formData.avatar_url || null,
        });

        toast({
          title: "Sucesso",
          description: "Membro atualizado com sucesso.",
        });
      } else {
        // Criar novo usuário
        const newUser = await userService.createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          avatar_url: formData.avatar_url || undefined,
        }, selectedAccounts);

        if (newUser) {
          toast({
            title: "Sucesso",
            description: "Membro criado com sucesso.",
          });
        } else {
          throw new Error('Falha ao criar usuário');
        }
      }

      // Atualizar a lista
      refetch();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving member:', error);
      toast({
        title: "Erro",
        description: editingMember ? "Erro ao atualizar membro." : "Erro ao criar membro.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = () => {
    toast({
      title: "Membro excluído",
      description: "O membro foi excluído com sucesso.",
    });
    setDeleteMemberId(null);
  };

  const getMemberAccounts = (memberId: string) => {
    return accounts.filter(account => 
      account.slots?.some(slot => slot.user_id === memberId)
    );
  };

  const isAdmin = currentUser?.role === 'admin';

  if (membersLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Carregando membros...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div />
        {isAdmin && (
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Membro
          </Button>
        )}
      </div>
      
      {/* Members Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Foto</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Contas Ativadas</TableHead>
              {isAdmin && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map(member => {
              const memberAccounts = getMemberAccounts(member.id);
              
              return (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                      <ImagePlaceholder
                        src={member.profile?.avatar_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={member.role === 'admin' ? "default" : "secondary"}>
                      {member.role === 'admin' ? 'Admin' : 'Membro'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {memberAccounts.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {memberAccounts.map(account => (
                          <Badge key={account.id} variant="secondary" className="text-xs">
                            {account.email}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Nenhuma conta</span>
                    )}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteMemberId(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Member Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? 'Editar Membro' : 'Novo Membro'}
            </DialogTitle>
            <DialogDescription>
              {editingMember ? 'Edite as informações do membro.' : 'Adicione um novo membro ao sistema.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  disabled={!!editingMember}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password">
                Senha {editingMember ? '(deixe em branco para manter a atual)' : '*'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required={!editingMember}
              />
            </div>
            
            <div>
              <Label htmlFor="avatar_url">URL da Foto</Label>
              <Input
                id="avatar_url"
                value={formData.avatar_url}
                onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                placeholder="https://exemplo.com/foto.jpg"
              />
            </div>

            <div className="grid gap-2">
              <Label>Contas</Label>
              <div className="text-sm text-muted-foreground">
                Vincule este membro às contas que ele pode usar
              </div>
              <div className="max-h-32 overflow-y-auto border rounded p-2">
                {accounts.map((account) => (
                  <div key={account.id} className="flex items-center space-x-2 py-1">
                    <Checkbox 
                      id={`account-${account.id}`}
                      checked={selectedAccounts.includes(account.id)}
                      onCheckedChange={() => handleAccountToggle(account.id)}
                    />
                    <Label htmlFor={`account-${account.id}`} className="text-sm">
                      {account.email}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingMember ? 'Atualizar' : 'Criar'} Membro
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteMemberId} onOpenChange={() => setDeleteMemberId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este membro? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminMembers;
