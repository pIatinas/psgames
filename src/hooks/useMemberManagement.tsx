import { useState } from 'react';
import { Member, Account } from '@/types';

export const useMemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
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

  const handleAccountToggle = (accountId: string, slotNumber: 1 | 2) => {
    const key = `${accountId}-${slotNumber}`;
    
    if (selectedAccounts.includes(key)) {
      setSelectedAccounts(selectedAccounts.filter(id => id !== key));
    } else {
      const filteredAccounts = selectedAccounts.filter(id => !id.startsWith(`${accountId}-`));
      setSelectedAccounts([...filteredAccounts, key]);
    }
  };

  const handleSaveMember = () => {
    if (isEditing && newMember.id) {
      const updatedMember = {
        ...members.find(member => member.id === newMember.id),
        ...newMember,
        updated_at: new Date().toISOString(),
      } as Member;
      
      const updatedAccounts = [...accounts];
      
      updatedAccounts.forEach(account => {
        if (account.slots) {
          account.slots = account.slots.filter(slot => slot.user_id !== updatedMember.id);
        }
      });
      
      selectedAccounts.forEach(key => {
        const [accountId, slotNumberStr] = key.split('-');
        const slotNumber = parseInt(slotNumberStr) as 1 | 2;
        const accountIndex = updatedAccounts.findIndex(a => a.id === accountId);
        
        if (accountIndex !== -1) {
          if (!updatedAccounts[accountIndex].slots) {
            updatedAccounts[accountIndex].slots = [];
          }
          updatedAccounts[accountIndex].slots?.push({
            id: `slot-${Date.now()}-${Math.random()}`,
            account_id: accountId,
            slot_number: slotNumber,
            user_id: updatedMember.id,
            entered_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });
        }
      });
      
      setMembers(members.map(member => 
        member.id === updatedMember.id ? updatedMember : member
      ));
      setAccounts(updatedAccounts);
    } else {
      const memberToAdd = {
        ...newMember,
        id: `member-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        payments: [],
      } as Member;
      
      const updatedAccounts = [...accounts];
      selectedAccounts.forEach(key => {
        const [accountId, slotNumberStr] = key.split('-');
        const slotNumber = parseInt(slotNumberStr) as 1 | 2;
        const accountIndex = updatedAccounts.findIndex(a => a.id === accountId);
        
        if (accountIndex !== -1) {
          if (!updatedAccounts[accountIndex].slots) {
            updatedAccounts[accountIndex].slots = [];
          }
          updatedAccounts[accountIndex].slots?.push({
            id: `slot-${Date.now()}-${Math.random()}`,
            account_id: accountId,
            slot_number: slotNumber,
            user_id: memberToAdd.id,
            entered_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });
        }
      });
      
      setMembers([...members, memberToAdd]);
      setAccounts(updatedAccounts);
    }
    
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
      account.slots?.forEach(slot => {
        if (slot.user_id === member.id) {
          memberAccountSlots.push(`${account.id}-${slot.slot_number}`);
        }
      });
    });
    
    setSelectedAccounts(memberAccountSlots);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteMember = (id: string) => {
    // Remove member from all account slots
    const updatedAccounts = accounts.map(account => {
      const updatedAccount = {...account};
      if (updatedAccount.slots) {
        updatedAccount.slots = updatedAccount.slots.filter(slot => slot.user_id !== id);
      }
      return updatedAccount;
    });
    
    setMembers(members.filter(member => member.id !== id));
    setAccounts(updatedAccounts);
  };

  return {
    members,
    accounts,
    newMember,
    setNewMember,
    selectedAccounts,
    setSelectedAccounts,
    isEditing,
    setIsEditing,
    open,
    setOpen,
    handleAccountToggle,
    handleSaveMember,
    handleEditMember,
    handleDeleteMember,
  };
};
