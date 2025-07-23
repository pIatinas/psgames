
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Plus, Trash } from 'lucide-react';
import { Account, Game } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { accountService, gameService } from '@/services/supabaseService';

const AdminAccounts: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    email: '',
    password: '',
    codes: '',
    qr_code: '',
    birthday: '',
    security_answer: ''
  });
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  // Load data and check authentication
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para acessar esta área.",
        variant: "destructive",
      });
      navigate('/');
    } else if (!currentUser) {
      toast({
        title: "Login Necessário",
        description: "Faça login para acessar esta área.",
        variant: "destructive",
      });
      navigate('/login');
    } else {
      loadData();
    }
  }, [currentUser, navigate, toast]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [accountsData, gamesData] = await Promise.all([
        accountService.getAll(),
        gameService.getAll()
      ]);
      setAccounts(accountsData);
      setGames(gamesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGameToggle = (gameId: string) => {
    if (selectedGames.includes(gameId)) {
      setSelectedGames(selectedGames.filter(id => id !== gameId));
    } else {
      setSelectedGames([...selectedGames, gameId]);
    }
  };

  const handleSaveAccount = async () => {
    if (!newAccount.email || !newAccount.password) {
      toast({
        title: "Erro",
        description: "Email e senha são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      if (isEditing && newAccount.id) {
        const updatedAccount = await accountService.update(newAccount.id, newAccount, selectedGames);
        setAccounts(accounts.map(account => 
          account.id === newAccount.id ? updatedAccount : account
        ));
      } else {
        const accountToAdd = await accountService.create(newAccount, selectedGames);
        setAccounts([...accounts, accountToAdd]);
      }
      
      setNewAccount({ email: '', password: '', codes: '', qr_code: '', birthday: '', security_answer: '' });
      setSelectedGames([]);
      setIsEditing(false);
      setOpen(false);
      
      toast({
        title: "Sucesso",
        description: isEditing ? "Conta atualizada com sucesso." : "Conta criada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar conta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditAccount = (account: Account) => {
    setNewAccount(account);
    setSelectedGames(account.games?.map(game => game.id) || []);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      await accountService.delete(id);
      setAccounts(accounts.filter(account => account.id !== id));
      toast({
        title: "Sucesso",
        description: "Conta excluída com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir conta.",
        variant: "destructive",
      });
    }
  };

  // Return null if not authenticated
  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Conta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-white">{isEditing ? 'Editar Conta' : 'Adicionar Nova Conta'}</DialogTitle>
              <DialogDescription className="text-white">
                Preencha os detalhes da conta abaixo.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={newAccount.email || ''} 
                  onChange={(e) => setNewAccount({...newAccount, email: e.target.value})}
                  className="text-white"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-white">Senha</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={newAccount.password || ''} 
                  onChange={(e) => setNewAccount({...newAccount, password: e.target.value})}
                  className="text-white"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="codes">Códigos</Label>
                <Input 
                  id="codes" 
                  value={newAccount.codes || ''} 
                  onChange={(e) => setNewAccount({...newAccount, codes: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="qr_code">QR Code URL</Label>
                <Input 
                  id="qr_code" 
                  value={newAccount.qr_code || ''} 
                  onChange={(e) => setNewAccount({...newAccount, qr_code: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="birthday">Aniversário</Label>
                <Input 
                  id="birthday" 
                  type="date"
                  value={newAccount.birthday || ''} 
                  onChange={(e) => setNewAccount({...newAccount, birthday: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label className="text-white">Jogos Vinculados</Label>
                <div className="max-h-48 overflow-y-auto border rounded-md p-2">
                  {games.map(game => (
                    <div key={game.id} className="flex items-center space-x-2 py-1">
                      <Checkbox 
                        id={`game-${game.id}`}
                        checked={selectedGames.includes(game.id)}
                        onCheckedChange={() => handleGameToggle(game.id)}
                      />
                      <Label htmlFor={`game-${game.id}`} className="cursor-pointer text-white">
                        {game.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setOpen(false);
                setNewAccount({ email: '', password: '', codes: '', qr_code: '', birthday: '', security_answer: '' });
                setSelectedGames([]);
                setIsEditing(false);
              }}>
                Cancelar
              </Button>
              <Button onClick={handleSaveAccount}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Jogos</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Data de Criação</TableHead>
              <TableHead className="text-right text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map(account => {
              // Calculate available slots
              const availableSlots = 2 - (account.slots?.length || 0);
              
              return (
                <TableRow key={account.id}>
                  <TableCell className="font-medium text-white">{account.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {account.games?.slice(0, 3).map(game => (
                        <span key={game.id} className="px-2 py-1 text-xs bg-secondary rounded-full text-white">
                          {game.name}
                        </span>
                      ))}
                      {account.games && account.games.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-secondary rounded-full text-white">
                          +{account.games.length - 3} mais
                        </span>
                      )}
                      {(!account.games || account.games.length === 0) && (
                        <span className="text-xs text-muted-foreground">Sem jogos</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      availableSlots === 2 ? 'bg-green-500 text-white' :
                      availableSlots === 1 ? 'bg-blue-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {availableSlots} {availableSlots === 1 ? 'slot disponível' : 'slots disponíveis'}
                    </span>
                  </TableCell>
                  <TableCell className="text-white">{new Date(account.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditAccount(account)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteAccount(account.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAccounts;
