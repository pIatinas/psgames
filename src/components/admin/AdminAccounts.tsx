
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Eye, EyeOff } from 'lucide-react';
import { Account, Game } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { accountService, gameService } from '@/services/supabaseService';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const AdminAccounts: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<Omit<Account, 'id' | 'created_at' | 'updated_at' | 'games' | 'slots'>>({
    email: '',
    password: '',
    birthday: '',
    security_answer: '',
    codes: '',
    qr_code: ''
  });
  const [selectedGames, setSelectedGames] = useState<string[]>([]);

  const { data: accounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ['admin-accounts'],
    queryFn: () => accountService.getAll(),
  });

  const { data: games = [] } = useQuery({
    queryKey: ['admin-games'],
    queryFn: () => gameService.getAll(),
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
    setSelectedGames([]);
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
    setSelectedGames(account.games?.map(game => game.id) || []);
    setIsDialogOpen(true);
  };

  const handleDelete = async (accountId: string) => {
    const success = await accountService.delete(accountId);
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
  };

  const togglePasswordVisibility = (accountId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  const handleGameSelection = (gameId: string, checked: boolean) => {
    if (checked) {
      setSelectedGames(prev => [...prev, gameId]);
    } else {
      setSelectedGames(prev => prev.filter(id => id !== gameId));
    }
  };

  // Helper functions for slot management
  const getSlotByNumber = (account: Account, slotNumber: number) => {
    return account.slots?.find(slot => slot.slot_number === slotNumber);
  };

  const isSlotOccupied = (account: Account, slotNumber: number) => {
    return getSlotByNumber(account, slotNumber) !== undefined;
  };

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
        <h2 className="text-2xl font-bold text-white">Gerenciar Contas</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Conta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAccount ? 'Editar Conta' : 'Nova Conta'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="codes">Códigos de Acesso</Label>
                <Textarea
                  id="codes"
                  value={formData.codes}
                  onChange={(e) => setFormData(prev => ({ ...prev, codes: e.target.value }))}
                  placeholder="Digite os códigos de acesso (um por linha)"
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
      </div>

      <div className="grid gap-4">
        {accounts.map(account => (
          <Card key={account.id}>
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
                    onClick={() => handleDelete(account.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Senha:</strong>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">
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
                {account.birthday && (
                  <div>
                    <strong>Nascimento:</strong> {account.birthday}
                  </div>
                )}
                {account.security_answer && (
                  <div>
                    <strong>Resposta de Segurança:</strong> {account.security_answer}
                  </div>
                )}
                {account.codes && (
                  <div>
                    <strong>Códigos:</strong> {account.codes}
                  </div>
                )}
              </div>

              {account.games && account.games.length > 0 && (
                <div className="mt-4">
                  <strong className="text-sm">Jogos:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {account.games.map(game => (
                      <Badge key={game.id} variant="secondary" className="text-xs">
                        {game.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminAccounts;
