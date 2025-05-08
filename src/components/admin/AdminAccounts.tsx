
import React, { useState } from 'react';
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

const AdminAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>(accountsData);
  const [games] = useState<Game[]>(gamesData);
  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    name: '',
    email: '',
    password: '',
    code: '',
    qrcode: '',
    response: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSaveAccount = () => {
    if (isEditing && newAccount.id) {
      // Update existing account
      setAccounts(accounts.map(account => 
        account.id === newAccount.id ? { ...account, ...newAccount } as Account : account
      ));
    } else {
      // Add new account
      const accountToAdd = {
        ...newAccount,
        id: `account-${Date.now()}`,
        created_at: new Date(),
        birthday: new Date(),
      } as Account;
      setAccounts([...accounts, accountToAdd]);
    }
    
    // Reset form
    setNewAccount({ name: '', email: '', password: '', code: '', qrcode: '', response: '' });
    setIsEditing(false);
    setOpen(false);
  };

  const handleEditAccount = (account: Account) => {
    setNewAccount(account);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-pink-500">Gerenciar Contas</h2>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Conta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar Conta' : 'Adicionar Nova Conta'}</DialogTitle>
              <DialogDescription>
                Preencha os detalhes da conta abaixo.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input 
                  id="name" 
                  value={newAccount.name} 
                  onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={newAccount.email} 
                  onChange={(e) => setNewAccount({...newAccount, email: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={newAccount.password} 
                  onChange={(e) => setNewAccount({...newAccount, password: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="code">Código</Label>
                <Input 
                  id="code" 
                  value={newAccount.code} 
                  onChange={(e) => setNewAccount({...newAccount, code: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="qrcode">QR Code URL</Label>
                <Input 
                  id="qrcode" 
                  value={newAccount.qrcode} 
                  onChange={(e) => setNewAccount({...newAccount, qrcode: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="response">Resposta Secreta</Label>
                <Input 
                  id="response" 
                  value={newAccount.response} 
                  onChange={(e) => setNewAccount({...newAccount, response: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setOpen(false);
                setNewAccount({ name: '', email: '', password: '', code: '', qrcode: '', response: '' });
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
              <TableHead>Email</TableHead>
              <TableHead>Jogos</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map(account => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">{account.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {account.games?.slice(0, 3).map(game => (
                      <span key={game.id} className="px-2 py-1 text-xs bg-secondary rounded-full">
                        {game.name}
                      </span>
                    ))}
                    {account.games && account.games.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-secondary rounded-full">
                        +{account.games.length - 3} mais
                      </span>
                    )}
                    {(!account.games || account.games.length === 0) && (
                      <span className="text-xs text-muted-foreground">Sem jogos</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{new Date(account.created_at).toLocaleDateString()}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAccounts;
