import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Eye, EyeOff } from 'lucide-react';
import { Account } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { accountService, gameService } from '@/services/supabaseService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
const AdminAccounts: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const {
    currentUser
  } = useAuth();
  const [formData, setFormData] = useState<Omit<Account, 'id' | 'created_at' | 'updated_at' | 'games' | 'slots'>>({
    email: '',
    password: '',
    birthday: '',
    security_answer: '',
    codes: '',
    qr_code: ''
  });
  const {
    data: accounts = [],
    isLoading: accountsLoading
  } = useQuery({
    queryKey: ['admin-accounts'],
    queryFn: () => accountService.getAll()
  });
  const {
    data: games = []
  } = useQuery({
    queryKey: ['admin-games'],
    queryFn: () => gameService.getAll()
  });
  useEffect(() => {
    if (editingAccount) {
      setFormData({
        email: editingAccount.email,
        password: editingAccount.password,
        birthday: editingAccount.birthday || '',
        security_answer: editingAccount.security_answer || '',
        codes: editingAccount.codes || '',
        qr_code: editingAccount.qr_code || ''
      });
      // Load linked games for this account
      const linkedGames = editingAccount.games || [];
      setSelectedGames(linkedGames.map(game => game.id));
    } else {
      setFormData({
        email: '',
        password: '',
        birthday: '',
        security_answer: '',
        codes: '',
        qr_code: ''
      });
      setSelectedGames([]);
    }
  }, [editingAccount]);
  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      birthday: '',
      security_answer: '',
      codes: '',
      qr_code: ''
    });
    setSelectedGames([]);
    setEditingAccount(null);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({
        title: "Erro",
        description: "Email e senha são obrigatórios.",
        variant: "destructive"
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
      // Link account to selected games
      await accountService.linkToGames(result.id, selectedGames);
      queryClient.invalidateQueries({
        queryKey: ['admin-accounts']
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-games']
      });
      toast({
        title: editingAccount ? "Conta atualizada" : "Conta criada",
        description: editingAccount ? "A conta foi atualizada com sucesso." : "A nova conta foi criada com sucesso."
      });
      setIsDialogOpen(false);
      resetForm();
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a conta.",
        variant: "destructive"
      });
    }
  };
  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setIsDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (!deleteAccountId) return;
    const success = await accountService.delete(deleteAccountId);
    if (success) {
      queryClient.invalidateQueries({
        queryKey: ['admin-accounts']
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-games']
      });
      toast({
        title: "Conta excluída",
        description: "A conta foi excluída com sucesso."
      });
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conta.",
        variant: "destructive"
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
  const handleGameToggle = (gameId: string) => {
    setSelectedGames(prev => prev.includes(gameId) ? prev.filter(id => id !== gameId) : [...prev, gameId]);
  };
  const getSlotOccupant = (account: Account, slotNumber: number) => {
    const slot = account.slots?.find(slot => slot.slot_number === slotNumber);
    return slot ? 'Ocupado' : 'Livre';
  };
  const isAdmin = currentUser?.role === 'admin';
  if (accountsLoading) {
    return <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Carregando contas...</p>
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div />
        {isAdmin && <Button onClick={() => {
        resetForm();
        setIsDialogOpen(true);
      }}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Conta
          </Button>}
      </div>

      {/* Accounts Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Senha</TableHead>
              <TableHead>Jogos</TableHead>
              <TableHead>Slot 1</TableHead>
              <TableHead>Slot 2</TableHead>
              <TableHead>Resposta</TableHead>
              <TableHead>Códigos</TableHead>
              {isAdmin && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map(account => <TableRow key={account.id}>
                <TableCell className="font-medium">{account.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">
                      {showPasswords[account.id] ? account.password : '••••••••'}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => togglePasswordVisibility(account.id)}>
                      {showPasswords[account.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  {account.games && account.games.length > 0 ? <div className="flex flex-wrap gap-1">
                      {account.games.slice(0, 2).map(game => <Badge key={game.id} variant="secondary" className="text-xs rounded-none bg-transparent p-0">
                          {game.name}
                        </Badge>)}
                      {account.games.length > 2 && <Badge variant="secondary" className="text-xs">
                          +{account.games.length - 2}
                        </Badge>}
                    </div> : <span className="text-muted-foreground text-sm">Nenhum jogo</span>}
                </TableCell>
                <TableCell>
                  <Badge variant={getSlotOccupant(account, 1) === 'Ocupado' ? "destructive" : "secondary"} className="rounded-sm">
                    {getSlotOccupant(account, 1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getSlotOccupant(account, 2) === 'Ocupado' ? "destructive" : "secondary"} className="rounded-sm">
                    {getSlotOccupant(account, 2)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {account.security_answer || '-'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {account.codes ? 'Sim' : '-'}
                  </span>
                </TableCell>
                {isAdmin && <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(account)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => setDeleteAccountId(account.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>}
              </TableRow>)}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Account Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                  <Input id="email" type="email" value={formData.email} onChange={e => setFormData(prev => ({
                  ...prev,
                  email: e.target.value
                }))} required />
                </div>
                <div>
                  <Label htmlFor="password">Senha *</Label>
                  <Input id="password" type="password" value={formData.password} onChange={e => setFormData(prev => ({
                  ...prev,
                  password: e.target.value
                }))} required />
                </div>
                <div>
                  <Label htmlFor="birthday">Data de Nascimento</Label>
                  <Input id="birthday" type="date" value={formData.birthday} onChange={e => setFormData(prev => ({
                  ...prev,
                  birthday: e.target.value
                }))} />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="security_answer">Resposta de Segurança</Label>
                  <Input id="security_answer" value={formData.security_answer} onChange={e => setFormData(prev => ({
                  ...prev,
                  security_answer: e.target.value
                }))} />
                </div>
                <div>
                  <Label htmlFor="codes">Códigos de Acesso</Label>
                  <Textarea id="codes" value={formData.codes} onChange={e => setFormData(prev => ({
                  ...prev,
                  codes: e.target.value
                }))} placeholder="Digite os códigos de acesso" rows={3} />
                </div>
                <div>
                  <Label htmlFor="qr_code">QR Code</Label>
                  <Input id="qr_code" value={formData.qr_code} onChange={e => setFormData(prev => ({
                  ...prev,
                  qr_code: e.target.value
                }))} placeholder="URL do QR Code" />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Jogos disponíveis nesta conta</Label>
              <div className="text-sm text-muted-foreground">
                Selecione os jogos que estão disponíveis nesta conta
              </div>
              <div className="max-h-32 overflow-y-auto border rounded p-2">
                {games.map(game => <div key={game.id} className="flex items-center space-x-2 py-1">
                    <Checkbox id={`game-${game.id}`} checked={selectedGames.includes(game.id)} onCheckedChange={() => handleGameToggle(game.id)} />
                    <Label htmlFor={`game-${game.id}`} className="text-sm">
                      {game.name}
                    </Label>
                  </div>)}
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
    </div>;
};
export default AdminAccounts;