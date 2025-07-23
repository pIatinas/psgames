
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Plus, Edit, Trash, UserMinus } from 'lucide-react';
import { Account } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { accountService, gameService } from '@/services/supabaseService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import ImagePlaceholder from '@/components/ui/image-placeholder';

const AdminAccounts: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<Account>>({
    email: '',
    password: '',
    birthday: '',
    security_answer: '',
    codes: '',
    qr_code: '',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['admin-accounts'],
    queryFn: () => accountService.getAll(),
  });

  const { data: games = [] } = useQuery({
    queryKey: ['admin-games'],
    queryFn: () => gameService.getAll(),
  });

  useEffect(() => {
    if (editingAccount) {
      setFormData(editingAccount);
      // Encontrar jogos que estão nesta conta
      const accountGames = editingAccount.games?.map(game => game.id) || [];
      setSelectedGames(accountGames);
    } else {
      setFormData({
        email: '',
        password: '',
        birthday: '',
        security_answer: '',
        codes: '',
        qr_code: '',
      });
      setSelectedGames([]);
    }
  }, [editingAccount]);

  const handleAddAccount = () => {
    setEditingAccount(null);
    setIsDialogOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteAccountId) return;
    
    const success = await accountService.delete(deleteAccountId);
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['admin-accounts'] });
      toast({
        title: "Conta removida",
        description: "A conta foi removida com sucesso.",
      });
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível remover a conta.",
        variant: "destructive",
      });
    }
    setDeleteAccountId(null);
  };

  const handleSaveAccount = async () => {
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
      result = await accountService.update(editingAccount.id, formData, selectedGames);
    } else {
      result = await accountService.create(formData as Omit<Account, 'id' | 'created_at' | 'updated_at' | 'games' | 'slots'>, selectedGames);
    }

    if (result) {
      queryClient.invalidateQueries({ queryKey: ['admin-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-games'] });
      toast({
        title: editingAccount ? "Conta atualizada" : "Conta adicionada",
        description: editingAccount ? "A conta foi atualizada com sucesso." : "A conta foi adicionada com sucesso.",
      });
      setIsDialogOpen(false);
      setEditingAccount(null);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a conta.",
        variant: "destructive",
      });
    }
  };

  const handleGameToggle = (gameId: string) => {
    setSelectedGames(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  const handleFreeSlot = async (accountId: string, slotNumber: number) => {
    const success = await accountService.freeSlot(accountId, slotNumber);
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['admin-accounts'] });
      toast({
        title: "Slot liberado",
        description: `Slot ${slotNumber} foi liberado com sucesso.`,
      });
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível liberar o slot.",
        variant: "destructive",
      });
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Carregando contas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div />
        {isAdmin && (
          <Button onClick={handleAddAccount}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Conta
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
              <TableHead>Slot 1</TableHead>
              <TableHead>Slot 2</TableHead>
              <TableHead>Códigos</TableHead>
              <TableHead>QR Code</TableHead>
              {isAdmin && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => {
              const slot1 = account.slots?.find(slot => slot.slot_number === 1);
              const slot2 = account.slots?.find(slot => slot.slot_number === 2);
              
              return (
                <TableRow key={account.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{account.email}</p>
                      <p className="text-sm text-muted-foreground">••••••••</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {account.games && account.games.length > 0 ? (
                        account.games.slice(0, 2).map((game) => (
                          <Badge key={game.id} variant="secondary" className="text-xs">
                            {game.name.length > 10 ? `${game.name.slice(0, 10)}...` : game.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">Nenhum jogo</span>
                      )}
                      {account.games && account.games.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{account.games.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {slot1?.user_id ? (
                      <div className="flex items-center justify-between">
                        <Badge variant="destructive" className="text-xs">
                          Ocupado
                        </Badge>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFreeSlot(account.id, 1)}
                          >
                            <UserMinus className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Livre
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {slot2?.user_id ? (
                      <div className="flex items-center justify-between">
                        <Badge variant="destructive" className="text-xs">
                          Ocupado
                        </Badge>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFreeSlot(account.id, 2)}
                          >
                            <UserMinus className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Livre
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="text-xs font-mono">{account.codes || 'N/A'}</p>
                  </TableCell>
                  <TableCell>
                    {account.qr_code ? (
                      <div className="w-8 h-8">
                        <ImagePlaceholder
                          src={account.qr_code}
                          alt="QR Code"
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAccount(account)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteAccountId(account.id)}
                        >
                          <Trash className="h-4 w-4" />
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

      {/* Add/Edit Account Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAccount ? 'Editar Conta' : 'Adicionar Nova Conta'}
            </DialogTitle>
            <DialogDescription>
              {editingAccount 
                ? 'Edite as informações da conta abaixo.' 
                : 'Preencha as informações da nova conta.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="exemplo@email.com"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="birthday">Data de Nascimento</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={formData.birthday || ''}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="codes">Códigos</Label>
                <Input
                  id="codes"
                  value={formData.codes || ''}
                  onChange={(e) => setFormData({ ...formData, codes: e.target.value })}
                  placeholder="ABC123"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="security_answer">Resposta de Segurança</Label>
              <Input
                id="security_answer"
                value={formData.security_answer || ''}
                onChange={(e) => setFormData({ ...formData, security_answer: e.target.value })}
                placeholder="Resposta para pergunta de segurança"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="qr_code">URL do QR Code</Label>
              <Input
                id="qr_code"
                value={formData.qr_code || ''}
                onChange={(e) => setFormData({ ...formData, qr_code: e.target.value })}
                placeholder="https://exemplo.com/qrcode.png"
              />
            </div>

            <div className="grid gap-2">
              <Label>Jogos</Label>
              <div className="text-sm text-muted-foreground">
                Vincule esta conta aos jogos disponíveis
              </div>
              <div className="max-h-32 overflow-y-auto border rounded p-2">
                {games.map((game) => (
                  <div key={game.id} className="flex items-center space-x-2 py-1">
                    <Checkbox 
                      id={`game-${game.id}`}
                      checked={selectedGames.includes(game.id)}
                      onCheckedChange={() => handleGameToggle(game.id)}
                    />
                    <Label htmlFor={`game-${game.id}`} className="text-sm">
                      {game.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAccount}>
              {editingAccount ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
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
