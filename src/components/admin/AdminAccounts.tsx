
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Eye, EyeOff } from 'lucide-react';
import { Account } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
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
import { accountService } from '@/services/supabaseService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import ImagePlaceholder from '@/components/ui/image-placeholder';

const AdminAccounts: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState<Omit<Account, 'id' | 'created_at' | 'updated_at' | 'games' | 'slots'>>({
    email: '',
    password: '',
    birthday: '',
    security_answer: '',
    codes: '',
    qr_code: ''
  });

  const { data: accounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ['admin-accounts'],
    queryFn: () => accountService.getAll(),
  });

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      birthday: '',
      security_answer: '',
      codes: '',
      qr_code: ''
    });
    setEditingAccount(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Erro",
        description: "Email e senha são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    let result;
    if (editingAccount) {
      result = await accountService.update(editingAccount.id, formData);
    } else {
      result = await accountService.create(formData);
    }

    if (result) {
      queryClient.invalidateQueries({ queryKey: ['admin-accounts'] });
      toast({
        title: editingAccount ? "Conta atualizada" : "Conta criada",
        description: editingAccount ? "A conta foi atualizada com sucesso." : "A nova conta foi criada com sucesso.",
      });
      setIsDialogOpen(false);
      resetForm();
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a conta.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      email: account.email,
      password: account.password,
      birthday: account.birthday || '',
      security_answer: account.security_answer || '',
      codes: account.codes || '',
      qr_code: account.qr_code || ''
    });
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteAccountId) return;
    
    const success = await accountService.delete(deleteAccountId);
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['admin-accounts'] });
      toast({
        title: "Conta excluída",
        description: "A conta foi excluída com sucesso.",
      });
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conta.",
        variant: "destructive",
      });
    }
    setDeleteAccountId(null);
  };

  const togglePasswordVisibility = (accountId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  // Helper functions for slot management
  const getSlotByNumber = (account: Account, slotNumber: number) => {
    return account.slots?.find(slot => slot.slot_number === slotNumber);
  };

  const isSlotOccupied = (account: Account, slotNumber: number) => {
    return getSlotByNumber(account, slotNumber) !== undefined;
  };

  const isAdmin = currentUser?.role === 'admin';

  if (accountsLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Carregando contas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-muted-foreground">Gerencie as contas do sistema</p>
        </div>
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Conta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAccount ? 'Editar Conta' : 'Nova Conta'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
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
                      <Label htmlFor="birthday">Data de Nascimento</Label>
                      <Input
                        id="birthday"
                        type="date"
                        value={formData.birthday}
                        onChange={(e) => setFormData(prev => ({ ...prev, birthday: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="security_answer">Resposta de Segurança</Label>
                      <Input
                        id="security_answer"
                        value={formData.security_answer}
                        onChange={(e) => setFormData(prev => ({ ...prev, security_answer: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="codes">Códigos de Acesso</Label>
                      <Textarea
                        id="codes"
                        value={formData.codes}
                        onChange={(e) => setFormData(prev => ({ ...prev, codes: e.target.value }))}
                        placeholder="Digite os códigos de acesso"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="qr_code">QR Code</Label>
                      <Input
                        id="qr_code"
                        value={formData.qr_code}
                        onChange={(e) => setFormData(prev => ({ ...prev, qr_code: e.target.value }))}
                        placeholder="URL do QR Code"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingAccount ? 'Atualizar' : 'Criar'} Conta
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(account => (
          <Card key={account.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{account.email}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">
                      {account.games?.length || 0} jogos
                    </Badge>
                    <Badge 
                      variant={isSlotOccupied(account, 1) ? "destructive" : "secondary"}
                    >
                      Slot 1: {isSlotOccupied(account, 1) ? 'Ocupado' : 'Livre'}
                    </Badge>
                    <Badge 
                      variant={isSlotOccupied(account, 2) ? "destructive" : "secondary"}
                    >
                      Slot 2: {isSlotOccupied(account, 2) ? 'Ocupado' : 'Livre'}
                    </Badge>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(account)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteAccountId(account.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <div>
                    <strong>Email:</strong>
                    <div className="text-muted-foreground">{account.email}</div>
                  </div>
                  <div>
                    <strong>Senha:</strong>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-muted-foreground">
                        {showPasswords[account.id] ? account.password : '••••••••'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePasswordVisibility(account.id)}
                      >
                        {showPasswords[account.id] ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </Button>
                    </div>
                  </div>
                  {account.games && account.games.length > 0 && (
                    <div>
                      <strong>Jogos:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {account.games.slice(0, 3).map(game => (
                          <Badge key={game.id} variant="secondary" className="text-xs">
                            {game.name}
                          </Badge>
                        ))}
                        {account.games.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{account.games.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  {account.security_answer && (
                    <div>
                      <strong>Resp. Segurança:</strong>
                      <div className="text-muted-foreground text-xs">{account.security_answer}</div>
                    </div>
                  )}
                  {account.codes && (
                    <div>
                      <strong>Códigos:</strong>
                      <div className="text-muted-foreground text-xs whitespace-pre-line">{account.codes}</div>
                    </div>
                  )}
                  {account.qr_code && (
                    <div>
                      <strong>QR Code:</strong>
                      <div className="mt-2">
                        <ImagePlaceholder
                          src={account.qr_code}
                          alt="QR Code"
                          className="w-20 h-20 rounded"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteAccountId} onOpenChange={() => setDeleteAccountId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.
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

export default AdminAccounts;
