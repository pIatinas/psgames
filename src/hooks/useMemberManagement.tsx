
import { useState } from 'react';
import { Member, Account } from '@/types';
import { members as membersData, accounts as accountsData } from '@/data/mockData';

export const useMemberManagement = () => {
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
