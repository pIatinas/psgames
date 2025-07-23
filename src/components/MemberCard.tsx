
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Gamepad2 } from 'lucide-react';

interface MemberCardProps {
  member: User;
  className?: string;
  activeAccountsCount?: number;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, className = '', activeAccountsCount = 0 }) => {
  // Obter as iniciais do nome
  const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  const memberPlaceholder = `https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=200&h=200&fit=crop&crop=face`;
  
  return (
    <Link to={`/members/${member.id}`} className={`block ${className}`}>
      <Card className="overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md rounded-lg">
        <div className="p-4 flex justify-center items-center">
          <Avatar className="h-16 w-16 border-2 border-accent/50">
            <AvatarImage src={member.profile?.avatar_url || memberPlaceholder} alt={member.name} />
            <AvatarFallback className="bg-accent/20 text-accent">{initials}</AvatarFallback>
          </Avatar>
        </div>
        <CardContent className="p-3 text-center">
          <h3 className="font-semibold text-base">{member.name}</h3>
          <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
            <Gamepad2 className="h-3.5 w-3.5" />
            {activeAccountsCount > 0 ? (
              <span>{activeAccountsCount} {activeAccountsCount === 1 ? 'conta ativa' : 'contas ativas'}</span>
            ) : (
              <span>Nenhuma conta ativa</span>
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {member.role === 'admin' ? 'Administrador' : 'Membro'}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MemberCard;
