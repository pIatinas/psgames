import React, { useState } from 'react';
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
import { accounts as accountsData, games as gamesData } from '@/data/mockData';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

const AdminAccounts: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>(accountsData);
  const [games, setGames] = useState<Game[]>(gamesData);
  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    email: '',
    password: '',
    code: '',
    qrcode: '',
    image: '',
  });
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  // Redirect if not admin
  React.useEffect(() => {
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
    }
  }, [currentUser, navigate, toast]);

  const handleGameToggle = (gameId: string) => {
    if (selectedGames.includes(gameId)) {
      setSelectedGames(selectedGames.filter(id => id !== gameId));
    } else {
      setSelectedGames([...selectedGames, gameId]);
    }
  };

  const handleSaveAccount = () => {
    // Get selected games objects
    const linkedGames = games.filter(game => selectedGames.includes(game.id));
    
    if (isEditing && newAccount.id) {
      // Update existing account
      setAccounts(accounts.map(account => 
        account.id === newAccount.id ? { 
          ...account, 
          ...newAccount,
          games: linkedGames 
        } as Account : account
      ));
    } else {
      // Add new account
      const accountToAdd = {
        ...newAccount,
        id: `account-${Date.now()}`,
        created_at: new Date(),
        games: linkedGames
      } as Account;
      setAccounts([...accounts, accountToAdd]);
    }
    
    // Reset form
    setNewAccount({ email: '', password: '', code: '', qrcode: '', image: '' });
    setSelectedGames([]);
    setIsEditing(false);
    setOpen(false);
  };

  const handleEditAccount = (account: Account) => {
    setNewAccount(account);
    setSelectedGames(account.games?.map(game => game.id) || []);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
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
                <Label htmlFor="code" className="text-white">Código</Label>
                <Input 
                  id="code" 
                  value={newAccount.code || ''} 
                  onChange={(e) => setNewAccount({...newAccount, code: e.target.value})}
                  className="text-white"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="qrcode" className="text-white">QR Code URL</Label>
                <Input 
                  id="qrcode" 
                  value={newAccount.qrcode || ''} 
                  onChange={(e) => setNewAccount({...newAccount, qrcode: e.target.value})}
                  className="text-white"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="image" className="text-white">Imagem URL</Label>
                <Input 
                  id="image" 
                  value={newAccount.image || ''} 
                  onChange={(e) => setNewAccount({...newAccount, image: e.target.value})}
                  className="text-white"
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
                setNewAccount({ email: '', password: '', code: '', qrcode: '', image: '' });
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
              const availableSlots = 2 - 
                (account.slot1 ? 1 : 0) - 
                (account.slot2 ? 1 : 0);
              
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
