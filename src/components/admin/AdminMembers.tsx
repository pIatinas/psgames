
import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger,
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
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { userService, accountService } from '@/services/supabaseService';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Member } from '@/types';
import ImagePlaceholder from '@/components/ui/image-placeholder';

const AdminMembers: React.FC = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profile_image: '',
  });

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
    accounts: accounts.filter(account => 
      account.slots?.some(slot => slot.user_id === user.id)
    ),
  }));

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      profile_image: '',
    });
    setEditingMember(null);
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      password: member.password || '',
      profile_image: member.profile_image || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A gestão de membros estará disponível em breve.",
    });
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeleteConfirm = () => {
    toast({
      title: "Funcionalidade em desenvolvimento", 
      description: "A exclusão de membros estará disponível em breve.",
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
        <div>
          <p className="text-muted-foreground">Gerencie os membros do sistema</p>
        </div>
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Membro
              </Button>
            </DialogTrigger>
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
                    />
                  </div>
                </div>
                
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
                
                <div>
                  <Label htmlFor="profile_image">URL da Foto</Label>
                  <Input
                    id="profile_image"
                    value={formData.profile_image}
                    onChange={(e) => setFormData(prev => ({ ...prev, profile_image: e.target.value }))}
                    placeholder="https://exemplo.com/foto.jpg"
                  />
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
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transformedMembers.map(member => {
          const memberAccounts = getMemberAccounts(member.id);
          
          return (
            <Card key={member.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                    <ImagePlaceholder
                      src={member.profile_image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={member.isApproved ? "default" : "secondary"}>
                        {member.isApproved ? 'Aprovado' : 'Pendente'}
                      </Badge>
                      <Badge variant="outline">
                        {memberAccounts.length} {memberAccounts.length === 1 ? 'conta' : 'contas'}
                      </Badge>
                    </div>
                  </div>
                  
                  {isAdmin && (
                    <div className="flex gap-2">
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
                  )}
                </div>
              </CardHeader>
              
              {memberAccounts.length > 0 && (
                <CardContent>
                  <div>
                    <strong className="text-sm">Contas Ativadas:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {memberAccounts.map(account => (
                        <Badge key={account.id} variant="secondary" className="text-xs">
                          {account.email}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

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
