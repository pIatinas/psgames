
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
import { Member, Account } from '@/types';
import { mockMembers, mockAccounts } from '@/data/mockData';

const AdminMembers: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [accounts] = useState<Account[]>(mockAccounts);
  const [newMember, setNewMember] = useState<Partial<Member>>({
    name: '',
    email: '',
    password: '',
    psn_id: '',
    profile_image: '',
    isApproved: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSaveMember = () => {
    if (isEditing && newMember.id) {
      // Update existing member
      setMembers(members.map(member => 
        member.id === newMember.id ? { ...member, ...newMember } as Member : member
      ));
    } else {
      // Add new member
      const memberToAdd = {
        ...newMember,
        id: `member-${Date.now()}`,
        created_at: new Date(),
        payments: [],
      } as Member;
      setMembers([...members, memberToAdd]);
    }
    
    // Reset form
    setNewMember({ name: '', email: '', password: '', psn_id: '', profile_image: '', isApproved: false });
    setIsEditing(false);
    setOpen(false);
  };

  const handleEditMember = (member: Member) => {
    setNewMember(member);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
  };

  const getMemberAccounts = (memberId: string): Account[] => {
    return accounts.filter(account => {
      return (
        (account.slot1 && account.slot1.member.id === memberId) ||
        (account.slot2 && account.slot2.member.id === memberId)
      );
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-pink-500">Gerenciar Membros</h2>
        
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
                  value={newMember.profile_image} 
                  onChange={(e) => setNewMember({...newMember, profile_image: e.target.value})}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isApproved" 
                  checked={newMember.isApproved}
                  onChange={(e) => setNewMember({...newMember, isApproved: e.target.checked})}
                />
                <Label htmlFor="isApproved">Aprovado</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setOpen(false);
                setNewMember({ name: '', email: '', password: '', psn_id: '', profile_image: '', isApproved: false });
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
                        <span className="text-xs text-muted-foreground">Sem contas</span>
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
