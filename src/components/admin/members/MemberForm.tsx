
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogFooter } from "@/components/ui/dialog";
import { Member, Account } from '@/types';

interface MemberFormProps {
  newMember: Partial<Member>;
  setNewMember: React.Dispatch<React.SetStateAction<Partial<Member>>>;
  selectedAccounts: string[];
  setSelectedAccounts: React.Dispatch<React.SetStateAction<string[]>>;
  accounts: Account[];
  handleAccountToggle: (accountId: string, slotNumber: 1 | 2) => void;
  handleSaveMember: () => void;
  isEditing: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MemberForm: React.FC<MemberFormProps> = ({ 
  newMember, 
  setNewMember, 
  selectedAccounts, 
  setSelectedAccounts,
  accounts, 
  handleAccountToggle, 
  handleSaveMember,
  isEditing,
  setOpen
}) => {
  return (
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
      
      <DialogFooter>
        <Button variant="outline" onClick={() => {
          setOpen(false);
          setNewMember({ name: '', email: '', password: '', psn_id: '', profile_image: '', isApproved: false });
          setSelectedAccounts([]);
        }}>
          Cancelar
        </Button>
        <Button onClick={handleSaveMember}>Salvar</Button>
      </DialogFooter>
    </div>
  );
};

export default MemberForm;
