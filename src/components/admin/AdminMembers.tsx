
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { supabase } from '@/integrations/supabase/client';

const AdminMembers: React.FC = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);
  const [selectedAccountSlots, setSelectedAccountSlots] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profile_image: ''
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
      profile_image: ''
    });
    setSelectedAccountSlots([]);
    setEditingMember(null);
  };

  const handleEdit = (member: User) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      password: '',
      profile_image: member.profile?.avatar_url || ''
    });

    // Find selected account slots for this member
    const memberSlots: string[] = [];
    accounts.forEach(account => {
      account.slots?.forEach(slot => {
        if (slot.user_id === member.id) {
          memberSlots.push(`${account.id}-${slot.slot_number}`);
        }
      });
    });
    setSelectedAccountSlots(memberSlots);
    setIsDialogOpen(true);
  };

  const handleAccountSlotToggle = (accountId: string, slotNumber: 1 | 2) => {
    const slotKey = `${accountId}-${slotNumber}`;
    setSelectedAccountSlots(prev => 
      prev.includes(slotKey) 
        ? prev.filter(key => key !== slotKey)
        : [...prev, slotKey]
    );
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
        // Update existing member
        await userService.updateProfile(editingMember.id, {
          name: formData.name,
          avatar_url: formData.profile_image
        });

        // Update account slots
        const accountSlots = selectedAccountSlots.map(slotKey => {
          const [accountId, slotNumber] = slotKey.split('-');
          return {
            accountId,
            slotNumber: parseInt(slotNumber) as 1 | 2
          };
        });
        await userService.linkToAccounts(editingMember.id, accountSlots);

        toast({
          title: "Membro atualizado",
          description: "O membro foi atualizado com sucesso."
        });
      } else {
        // Create new member
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: formData.email,
          password: formData.password,
          user_metadata: {
            name: formData.name
          }
        });

        if (authError) {
          toast({
            title: "Erro",
            description: "Não foi possível criar o usuário: " + authError.message,
            variant: "destructive"
          });
          return;
        }

        if (authData.user) {
          // Update profile with additional data
          await userService.updateProfile(authData.user.id, {
            name: formData.name,
            avatar_url: formData.profile_image
          });

          // Link account slots
          const accountSlots = selectedAccountSlots.map(slotKey => {
            const [accountId, slotNumber] = slotKey.split('-');
            return {
              accountId,
              slotNumber: parseInt(slotNumber) as 1 | 2
            };
          });
          await userService.linkToAccounts(authData.user.id, accountSlots);

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
      // Note: We can't delete auth users directly, only deactivate them
      toast({
        title: "Funcionalidade não disponível",
        description: "A exclusão de membros não está disponível por questões de segurança.",
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o membro.",
        variant: "destructive"
      });
    } finally {
      setDeleteMemberId(null);
    }
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
      {/* Members Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Foto</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contas</TableHead>
              <TableHead>Função</TableHead>
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
                    {memberAccounts.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {memberAccounts.map(account => {
                          const userSlots = account.slots?.filter(slot => slot.user_id === member.id) || [];
                          return userSlots.map(slot => (
                            <Badge key={`${account.id}-${slot.slot_number}`} variant="secondary" className="text-xs">
                              {account.email} (Slot {slot.slot_number})
                            </Badge>
                          ));
                        })}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Nenhuma conta</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.role === 'admin' ? "default" : "secondary"}>
                      {member.role === 'admin' ? 'Admin' : 'Membro'}
                    </Badge>
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
            
            <div>
              <Label htmlFor="profile_image">URL da Foto</Label>
              <Input 
                id="profile_image" 
                value={formData.profile_image} 
                onChange={(e) => setFormData(prev => ({ ...prev, profile_image: e.target.value }))}
                placeholder="https://exemplo.com/foto.jpg" 
              />
            </div>

            <div className="grid gap-2">
              <Label>Slots de Conta</Label>
              <div className="text-sm text-muted-foreground">
                Vincule este membro aos slots de conta que ele pode usar
              </div>
              <div className="max-h-48 overflow-y-auto border rounded p-2">
                {accounts.map(account => (
                  <div key={account.id} className="mb-2 border-b pb-2">
                    <div className="font-medium mb-1">{account.email}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`account-${account.id}-1`}
                          checked={selectedAccountSlots.includes(`${account.id}-1`)}
                          disabled={account.slots?.some(slot => 
                            slot.slot_number === 1 && 
                            slot.user_id !== (editingMember?.id || '')
                          )}
                          onCheckedChange={() => handleAccountSlotToggle(account.id, 1)}
                        />
                        <Label htmlFor={`account-${account.id}-1`} className="cursor-pointer">
                          Slot 1 {account.slots?.some(slot => 
                            slot.slot_number === 1 && 
                            slot.user_id !== (editingMember?.id || '')
                          ) ? '(Em uso)' : ''}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`account-${account.id}-2`}
                          checked={selectedAccountSlots.includes(`${account.id}-2`)}
                          disabled={account.slots?.some(slot => 
                            slot.slot_number === 2 && 
                            slot.user_id !== (editingMember?.id || '')
                          )}
                          onCheckedChange={() => handleAccountSlotToggle(account.id, 2)}
                        />
                        <Label htmlFor={`account-${account.id}-2`} className="cursor-pointer">
                          Slot 2 {account.slots?.some(slot => 
                            slot.slot_number === 2 && 
                            slot.user_id !== (editingMember?.id || '')
                          ) ? '(Em uso)' : ''}
                        </Label>
                      </div>
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
      </Dialog>
    </div>
  );
};

export default AdminMembers;
