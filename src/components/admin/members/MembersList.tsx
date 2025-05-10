
import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Member, Account } from '@/types';

interface MembersListProps {
  members: Member[];
  accounts: Account[];
  handleEditMember: (member: Member) => void;
  handleDeleteMember: (id: string) => void;
}

const MembersList: React.FC<MembersListProps> = ({ 
  members, 
  accounts, 
  handleEditMember, 
  handleDeleteMember 
}) => {
  // Get member's active accounts
  const getMemberAccounts = (memberId: string): Account[] => {
    return accounts.filter(account => {
      return (
        (account.slot1 && account.slot1.member.id === memberId) ||
        (account.slot2 && account.slot2.member.id === memberId)
      );
    });
  };

  return (
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
  );
};

export default MembersList;
