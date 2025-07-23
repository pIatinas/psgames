
import React from 'react';
import { Link } from 'react-router-dom';
import { Member } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Gamepad2 } from 'lucide-react';
import { accounts } from '@/data/mockData';

interface MemberCardProps {
  member: Member;
  className?: string;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, className = '' }) => {
  // Calcular quantas contas o membro está usando
  const activeAccounts = accounts.filter(account => 
    account.slots?.some(slot => slot.user_id === member.id)
  );
  
  // Obter as iniciais do nome
  const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  return (
    <Link to={`/members/${member.id}`} className={`block ${className}`}>
      <Card className="overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md rounded-lg">
        <div className="p-4 flex justify-center items-center">
          <Avatar className="h-16 w-16 border-2 border-accent/50">
            <AvatarImage src={member.profile_image} alt={member.name} />
            <AvatarFallback className="bg-accent/20 text-accent">{initials}</AvatarFallback>
          </Avatar>
        </div>
        <CardContent className="p-3 text-center">
          <h3 className="font-semibold text-base">{member.name}</h3>
          <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
            <Gamepad2 className="h-3.5 w-3.5" />
            {activeAccounts.length > 0 ? (
              <span>{activeAccounts.length} {activeAccounts.length === 1 ? 'conta ativa' : 'contas ativas'}</span>
            ) : (
              <span>Nenhuma conta ativa</span>
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PSN: {member.psn_id}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MemberCard;
