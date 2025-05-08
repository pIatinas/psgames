
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
import { Member, Account, SlotOccupation } from '@/types';
import { members as membersData, accounts as accountsData } from '@/data/mockData';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

const AdminMembers: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>(membersData);
  const [accounts, setAccounts] = useState<Account[]>(accountsData);
  const [newMember, setNewMember] = useState<Partial<Member>>({
    name: '',
    email: '',
    password: '',
    psn_id: '',
    profile_image: '',
    isApproved: false,
  });
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
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

  const handleAccountToggle = (accountId: string, slotNumber: 1 | 2) => {
    const key = `${accountId}-${slotNumber}`;
    
    if (selectedAccounts.includes(key)) {
      setSelectedAccounts(selectedAccounts.filter(id => id !== key));
    } else {
      // Remove any other selected accounts with the same accountId and slotNumber
      const filteredAccounts = selectedAccounts.filter(id => !id.startsWith(`${accountId}-`));
      setSelectedAccounts([...filteredAccounts, key]);
    }
  };

  const handleSaveMember = () => {
    if (isEditing && newMember.id) {
      // Update existing member
      const updatedMember = {
        ...members.find(member => member.id === newMember.id),
        ...newMember,
      } as Member;
      
      // Update member accounts
      const updatedAccounts = [...accounts];
      
      // First, remove member from all slots
      updatedAccounts.forEach(account => {
        if (account.slot1 && account.slot1.member.id === updatedMember.id) {
          account.slot1 = undefined;
        }
        if (account.slot2 && account.slot2.member.id === updatedMember.id) {
          account.slot2 = undefined;
        }
      });
      
      // Then add member to selected slots
      selectedAccounts.forEach(key => {
        const [accountId, slotNumber] = key.split('-');
        const accountIndex = updatedAccounts.findIndex(a => a.id === accountId);
        
        if (accountIndex !== -1) {
          const slot = `slot${slotNumber}` as 'slot1' | 'slot2';
          updatedAccounts[accountIndex][slot] = {
            member: updatedMember,
            entered_at: new Date()
          };
        }
      });
      
      setMembers(members.map(member => 
        member.id === updatedMember.id ? updatedMember : member
      ));
      setAccounts(updatedAccounts);
    } else {
      // Add new member
      const memberToAdd = {
        ...newMember,
        id: `member-${Date.now()}`,
        created_at: new Date(),
        payments: [],
      } as Member;
      
      // Update accounts with selected slots
      const updatedAccounts = [...accounts];
      selectedAccounts.forEach(key => {
        const [accountId, slotNumber] = key.split('-');
        const accountIndex = updatedAccounts.findIndex(a => a.id === accountId);
        
        if (accountIndex !== -1) {
          const slot = `slot${slotNumber}` as 'slot1' | 'slot2';
          updatedAccounts[accountIndex][slot] = {
            member: memberToAdd,
            entered_at: new Date()
          };
        }
      });
      
      setMembers([...members, memberToAdd]);
      setAccounts(updatedAccounts);
    }
    
    // Reset form
    setNewMember({ name: '', email: '', password: '', psn_id: '', profile_image: '', isApproved: false });
    setSelectedAccounts([]);
    setIsEditing(false);
    setOpen(false);
  };

  const handleEditMember = (member: Member) => {
    setNewMember(member);
    
    // Find accounts where this member is using slots
    const memberAccountSlots: string[] = [];
    accounts.forEach(account => {
      if (account.slot1 && account.slot1.member.id === member.id) {
        memberAccountSlots.push(`${account.id}-1`);
      }
      if (account.slot2 && account.slot2.member.id === member.id) {
        memberAccountSlots.push(`${account.id}-2`);
      }
    });
    
    setSelectedAccounts(memberAccountSlots);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteMember = (id: string) => {
    // Remove member from all account slots
    const updatedAccounts = accounts.map(account => {
      const updatedAccount = {...account};
      if (account.slot1 && account.slot1.member.id === id) {
        updatedAccount.slot1 = undefined;
      }
      if (account.slot2 && account.slot2.member.id === id) {
        updatedAccount.slot2 = undefined;
      }
      return updatedAccount;
    });
    
    setMembers(members.filter(member => member.id !== id));
    setAccounts(updatedAccounts);
  };

  // Get member's active accounts
  const getMemberAccounts = (memberId: string): Account[] => {
    return accounts.filter(account => {
      return (
        (account.slot1 && account.slot1.member.id === memberId) ||
        (account.slot2 && account.slot2.member.id === memberId)
      );
    });
  };

  // Return null if not authenticated or loading
  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gerenciar Membros</h2>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Membro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar Membro' : 'Adicionar Novo Membro'}</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do membro abaixo.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input 
                  id="name" 
                  value={newMember.name} 
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={newMember.email} 
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={newMember.password} 
                  onChange={(e) => setNewMember({...newMember, password: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="psn_id">PSN ID</Label>
                <Input 
                  id="psn_id" 
                  value={newMember.psn_id} 
                  onChange={(e) => setNewMember({...newMember, psn_id: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="profile_image">URL da Imagem de Perfil</Label>
                <Input 
                  id="profile_image" 
                  value={newMember.profile_image || ''} 
                  onChange={(e) => setNewMember({...newMember, profile_image: e.target.value})}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="isApproved" 
                  checked={newMember.isApproved || false}
                  onCheckedChange={(checked) => setNewMember({...newMember, isApproved: !!checked})}
                />
                <Label htmlFor="isApproved">Aprovado</Label>
              </div>
              
              <div className="grid gap-2">
                <Label>Contas Vinculadas</Label>
                <div className="max-h-48 overflow-y-auto border rounded-md p-2">
                  {accounts.map(account => (
                    <div key={account.id} className="mb-2 border-b pb-2">
                      <div className="font-medium mb-1">{account.email}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`account-${account.id}-1`}
                            checked={selectedAccounts.includes(`${account.id}-1`)}
                            disabled={account.slot1 && account.slot1.member.id !== (newMember.id || '')}
                            onCheckedChange={() => handleAccountToggle(account.id, 1)}
                          />
                          <Label htmlFor={`account-${account.id}-1`} className="cursor-pointer">
                            Slot 1 {account.slot1 && account.slot1.member.id !== (newMember.id || '') ? '(Em uso)' : ''}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`account-${account.id}-2`}
                            checked={selectedAccounts.includes(`${account.id}-2`)}
                            disabled={account.slot2 && account.slot2.member.id !== (newMember.id || '')}
                            onCheckedChange={() => handleAccountToggle(account.id, 2)}
                          />
                          <Label htmlFor={`account-${account.id}-2`} className="cursor-pointer">
                            Slot 2 {account.slot2 && account.slot2.member.id !== (newMember.id || '') ? '(Em uso)' : ''}
                          </Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setOpen(false);
                setNewMember({ name: '', email: '', password: '', psn_id: '', profile_image: '', isApproved: false });
                setSelectedAccounts([]);
                setIsEditing(false);
              }}>
                Cancelar
              </Button>
              <Button onClick={handleSaveMember}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>PSN ID</TableHead>
              <TableHead>Contas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map(member => {
              const memberAccounts = getMemberAccounts(member.id);
              
              return (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.psn_id}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {memberAccounts.length > 0 ? memberAccounts.map(account => (
                        <span key={account.id} className="px-2 py-1 text-xs bg-secondary rounded-full">
                          {account.email}
                        </span>
                      )) : (
                        <span className="text-xs text-muted-foreground">Nenhuma conta ativa</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${member.isApproved ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
                      {member.isApproved ? 'Aprovado' : 'Pendente'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditMember(member)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteMember(member.id)}>
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

export default AdminMembers;
