
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
import { useToast } from '@/hooks/use-toast';
import { accountService, gameService } from '@/services/supabaseService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Account } from '@/types';

interface AdminAccountsProps {
  onOpenModal?: () => void;
}

const AdminAccounts: React.FC<AdminAccountsProps> = ({ onOpenModal }) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    birthday: '',
    security_answer: '',
    codes: '',
    qr_code: ''
  });

  const { data: accounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ['admin-accounts'],
    queryFn: () => accountService.getAll()
  });

  const { data: games = [] } = useQuery({
    queryKey: ['admin-games'],
    queryFn: () => gameService.getAll()
  });

  const resetForm = () => {
    setFormData({
      email: '',
      birthday: '',
      security_answer: '',
      codes: '',
      qr_code: ''
    });
    setSelectedGames([]);
    setEditingAccount(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      email: account.email,
      birthday: account.birthday || '',
      security_answer: account.security_answer || '',
      codes: account.codes || '',
      qr_code: account.qr_code || ''
    });
    if (account.games) {
      setSelectedGames(account.games.map(g => g.id));
    }
    setIsDialogOpen(true);
  };

  const handleGameToggle = (gameId: string) => {
    setSelectedGames(prev =>
      prev.includes(gameId)
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (!formData.email) {
      toast({
        title: "Erro",
        description: "Email é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingAccount) {
        // Update existing account
        await accountService.update(editingAccount.id, {
          email: formData.email,
          birthday: formData.birthday,
          security_answer: formData.security_answer,
          codes: formData.codes,
          qr_code: formData.qr_code
        });

        // Link games to account
        await accountService.linkToGames(editingAccount.id, selectedGames);

        toast({
          title: "Conta atualizada",
          description: "A conta foi atualizada com sucesso."
        });
      } else {
        // Create new account
        const newAccount = await accountService.create({
          email: formData.email,
          birthday: formData.birthday,
          security_answer: formData.security_answer,
          codes: formData.codes,
          qr_code: formData.qr_code
        });

        if (newAccount) {
          // Link games to new account
          await accountService.linkToGames(newAccount.id, selectedGames);

          toast({
            title: "Conta criada",
            description: "A nova conta foi criada com sucesso."
          });
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível criar a conta.",
            variant: "destructive"
          });
          return;
        }
      }

      queryClient.invalidateQueries({ queryKey: ['admin-accounts'] });
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a conta.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteAccountId) return;

    try {
      const success = await accountService.delete(deleteAccountId);
      if (success) {
        // Remove from local state immediately
        queryClient.setQueryData(['admin-accounts'], (oldData: Account[] | undefined) => 
          oldData ? oldData.filter(account => account.id !== deleteAccountId) : []
        );
        queryClient.invalidateQueries({ queryKey: ['admin-accounts'] });
        toast({
          title: "Conta excluída",
          description: "A conta foi excluída com sucesso."
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conta.",
        variant: "destructive"
      });
    } finally {
      setDeleteAccountId(null);
    }
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
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Contas</h2>
        {isAdmin && (
          <Button 
            onClick={handleOpenCreateModal}
            className="bg-pink-500 hover:bg-pink-600 text-white rounded-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Conta
          </Button>
        )}
      </div>

      {/* Accounts Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Jogos</TableHead>
              <TableHead>Slots</TableHead>
              {/* <TableHead>Data de Nascimento</TableHead> */}
              {isAdmin && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map(account => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">{account.email}</TableCell>
                <TableCell>
                  {account.games && account.games.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {account.games.slice(0, 2).map(game => (
                        <span>
                          {game.name}
                        </span>
                      ))}
                      {account.games.length > 2 && (
                        <span>
                          +{account.games.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Nenhum jogo</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {[1, 2].map(slotNumber => {
                      const slot = account.slots?.find(s => s.slot_number === slotNumber);
                      const isOccupied = slot?.user_id;
                      
                      return (
                        <Badge 
                          key={slotNumber}
                          variant={isOccupied ? "destructive" : "secondary"}
                          className={`text-xs ${
                            isOccupied ? 'bg-red-500' : 'bg-green-500'
                          }`}
                        >
                          {isOccupied ? slot?.user?.name || 'Ocupado' : `Slot ${slotNumber}`}
                        </Badge>
                      );
                    })}
                  </div>
                </TableCell>
                {/* <TableCell>
                  {account.birthday ? new Date(account.birthday).toLocaleDateString() : 'N/A'}
                </TableCell> */}
                {isAdmin && (
                  <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.location.href = `/accounts/${account.id}`}
                          className="hover:bg-white hover:text-gray-900"
                        >
                          Ver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(account)}
                          className="hover:bg-white hover:text-gray-900"
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
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Account Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAccount ? 'Editar Conta' : 'Cadastrar Conta'}
            </DialogTitle>
            <DialogDescription>
              {editingAccount ? 'Edite as informações da conta.' : 'Adicione uma nova conta ao sistema.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="birthday">Data de Nascimento</Label>
              <Input 
                id="birthday" 
                type="date" 
                value={formData.birthday} 
                onChange={(e) => setFormData(prev => ({ ...prev, birthday: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="security_answer">Resposta de Segurança</Label>
              <Input 
                id="security_answer" 
                value={formData.security_answer} 
                onChange={(e) => setFormData(prev => ({ ...prev, security_answer: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="codes">Códigos</Label>
              <Input 
                id="codes" 
                value={formData.codes} 
                onChange={(e) => setFormData(prev => ({ ...prev, codes: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="qr_code">QR Code</Label>
              <Input 
                id="qr_code" 
                value={formData.qr_code} 
                onChange={(e) => setFormData(prev => ({ ...prev, qr_code: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label>Jogos Vinculados</Label>
              <div className="text-sm text-muted-foreground">
                Selecione os jogos que estarão disponíveis nesta conta
              </div>
              <div className="max-h-48 overflow-y-auto border rounded p-2">
                {games.map(game => (
                  <div key={game.id} className="flex items-center space-x-2 p-1">
                    <Checkbox 
                      id={`game-${game.id}`}
                      checked={selectedGames.includes(game.id)}
                      onCheckedChange={() => handleGameToggle(game.id)}
                    />
                    <Label htmlFor={`game-${game.id}`} className="cursor-pointer">
                      {game.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (editingAccount ? "Atualizando..." : "Criando...") : (editingAccount ? 'Atualizar' : 'Criar')} Conta
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
