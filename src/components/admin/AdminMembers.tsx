
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { userService, accountService } from '@/services/supabaseService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { User, Account } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminMembersProps {
  onOpenModal?: () => void;
}

const AdminMembers: React.FC<AdminMembersProps> = ({ onOpenModal }) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);
  const [selectedAccountSlots, setSelectedAccountSlots] = useState<Array<{ accountId: string, slotNumber: 1 | 2 }>>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member' as 'admin' | 'member',
    active: false
  });

  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ['admin-members'],
    queryFn: () => userService.getAll()
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ['admin-accounts'],
    queryFn: () => accountService.getAll()
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'member',
      active: false
    });
    setSelectedAccountSlots([]);
    setEditingMember(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (member: User) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      password: '',
      role: member.role,
      active: member.profile?.active || false
    });

    // Get member's current account slots
    const memberSlots: Array<{ accountId: string, slotNumber: 1 | 2 }> = [];
    accounts.forEach(account => {
      account.slots?.forEach(slot => {
        if (slot.user_id === member.id) {
          memberSlots.push({ 
            accountId: account.id, 
            slotNumber: slot.slot_number 
          });
        }
      });
    });
    setSelectedAccountSlots(memberSlots);
    setIsDialogOpen(true);
  };

  const handleAccountSlotToggle = (accountId: string, slotNumber: 1 | 2) => {
    setSelectedAccountSlots(prev => {
      const exists = prev.find(slot => slot.accountId === accountId && slot.slotNumber === slotNumber);
      if (exists) {
        return prev.filter(slot => !(slot.accountId === accountId && slot.slotNumber === slotNumber));
      } else {
        return [...prev, { accountId, slotNumber }];
      }
    });
  };

  const handleToggleActive = async (memberId: string, currentActive: boolean) => {
    try {
      const success = await userService.toggleUserActive(memberId, !currentActive);
      if (success) {
        toast({
          title: "Status atualizado",
          description: `Usuário ${!currentActive ? 'ativado' : 'desativado'} com sucesso.`
        });
        queryClient.invalidateQueries({ queryKey: ['admin-members'] });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o status do usuário.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do usuário.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingMember) {
        // Update existing member profile
        await userService.updateProfile(editingMember.id, {
          name: formData.name,
          role: formData.role,
          active: formData.active
        });

        // Update account slots
        await userService.linkToAccounts(editingMember.id, selectedAccountSlots);

        toast({
          title: "Membro atualizado",
          description: "O membro foi atualizado com sucesso."
        });
      } else {
        // Create new member
        if (!formData.password) {
          toast({
            title: "Erro",
            description: "Senha é obrigatória para novos membros.",
            variant: "destructive"
          });
          return;
        }

        const { user, error } = await userService.createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          active: formData.active
        });

        if (error) {
          toast({
            title: "Erro",
            description: "Não foi possível criar o usuário.",
            variant: "destructive"
          });
          return;
        }

        if (user) {
          // Link account slots
          await userService.linkToAccounts(user.id, selectedAccountSlots);

          toast({
            title: "Membro criado",
            description: "O novo membro foi criado com sucesso."
          });
        }
      }

      queryClient.invalidateQueries({ queryKey: ['admin-members'] });
      queryClient.invalidateQueries({ queryKey: ['admin-accounts'] });
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar membro:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o membro.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteMemberId) return;

    try {
      // Remove account associations
      await userService.linkToAccounts(deleteMemberId, []);
      
      toast({
        title: "Associações removidas",
        description: "As associações de conta do membro foram removidas."
      });
      
      queryClient.invalidateQueries({ queryKey: ['admin-members'] });
      queryClient.invalidateQueries({ queryKey: ['admin-accounts'] });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover as associações do membro.",
        variant: "destructive"
      });
    } finally {
      setDeleteMemberId(null);
    }
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
      {/* Add Member Button */}
      {isAdmin && (
        <div className="flex justify-end">
          <Button 
            onClick={handleOpenCreateModal}
            className="bg-pink-500 hover:bg-pink-600 text-white rounded-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Membro
          </Button>
        </div>
      )}

      {/* Members Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contas Ativas</TableHead>
              <TableHead>Criado em</TableHead>
              {isAdmin && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map(member => {
              const memberAccounts = accounts.filter(account => 
                account.slots?.some(slot => slot.user_id === member.id)
              );
              
              return (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                      {member.role === 'admin' ? 'Admin' : 'Membro'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.active ? 'default' : 'destructive'}>
                        {member.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                      {isAdmin && (
                        <Switch
                          checked={member.active}
                          onCheckedChange={() => handleToggleActive(member.id, member.active)}
                          size="sm"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {memberAccounts.length > 0 ? memberAccounts.map(account => (
                        <Badge key={account.id} variant="outline" className="text-xs">
                          {account.email}
                        </Badge>
                      )) : (
                        <span className="text-xs text-muted-foreground">Nenhuma conta ativa</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.profile?.created_at ? new Date(member.profile.created_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(member)}
                          className="hover:bg-white hover:text-gray-900"
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
              {editingMember ? 'Editar Membro' : 'Cadastrar Membro'}
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
                <Label htmlFor="email">Email *</Label>
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

            {!editingMember && (
              <div>
                <Label htmlFor="password">Senha *</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={formData.password} 
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required 
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value: 'admin' | 'member') => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Membro</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                />
                <Label>Usuário Ativo</Label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Contas Vinculadas</Label>
              <div className="text-sm text-muted-foreground">
                Selecione os slots das contas para este membro
              </div>
              <div className="max-h-48 overflow-y-auto border rounded p-2">
                {accounts.map(account => (
                  <div key={account.id} className="p-2 border-b last:border-b-0">
                    <div className="font-medium text-sm mb-2">{account.email}</div>
                    <div className="flex gap-4">
                      {[1, 2].map(slotNumber => {
                        const isSelected = selectedAccountSlots.some(slot => 
                          slot.accountId === account.id && slot.slotNumber === slotNumber
                        );
                        const isOccupied = account.slots?.some(slot => 
                          slot.slot_number === slotNumber && slot.user_id && slot.user_id !== editingMember?.id
                        );
                        
                        return (
                          <div key={slotNumber} className="flex items-center space-x-2">
                            <Checkbox
                              id={`account-${account.id}-slot-${slotNumber}`}
                              checked={isSelected}
                              disabled={isOccupied}
                              onCheckedChange={() => handleAccountSlotToggle(account.id, slotNumber as 1 | 2)}
                            />
                            <Label 
                              htmlFor={`account-${account.id}-slot-${slotNumber}`} 
                              className={`cursor-pointer text-xs ${isOccupied ? 'text-muted-foreground' : ''}`}
                            >
                              Slot {slotNumber} {isOccupied ? '(Ocupado)' : ''}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
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
            <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este membro? Esta ação removerá todas as associações de conta do membro.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminMembers;
