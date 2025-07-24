
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';
import { Link } from 'react-router-dom';
import { generateMemberSlug } from '@/utils/gameUtils';

interface MemberCardProps {
  member: User;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
      <Link to={`/members/${generateMemberSlug(member.id, member.name)}`} className="block">
        <CardContent className="p-4 text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {member.name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <h3 className="font-semibold text-sm mb-2 truncate">{member.name}</h3>
          
          <Badge 
            variant={member.role === 'admin' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {member.role === 'admin' ? 'Admin' : 'Membro'}
          </Badge>
        </CardContent>
      </Link>
    </Card>
  );
};

export default MemberCard;
