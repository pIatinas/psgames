import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';
import { Link } from 'react-router-dom';
import { generateMemberSlug } from '@/utils/gameUtils';
interface MemberCardProps {
  member: User;
  activeAccountsCount?: number;
}
const MemberCard: React.FC<MemberCardProps> = ({
  member,
  activeAccountsCount = 0
}) => {
  return <Card className="h-full hover:shadow-lg cursor-pointer hover:scale-105 transition-all ">
      <Link to={`/members/${generateMemberSlug(member.id, member.name)}`} className="block">
        <CardContent className="p-4 text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden">
            {member.profile?.avatar_url ? <img src={member.profile.avatar_url} alt={member.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {member.name.charAt(0).toUpperCase()}
                </span>
              </div>}
          </div>
          
          <h3 className="font-medium text-lg truncate mb-0">{member.name}</h3>
          <p className="text-xs text-muted-foreground mb-2 -mt-1">
            {activeAccountsCount} {activeAccountsCount === 1 ? 'conta ativa' : 'contas ativas'}
          </p>
          
          <Badge variant={member.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
            {member.role === 'admin' ? 'Admin' : 'Membro'}
          </Badge>
        </CardContent>
      </Link>
    </Card>;
};
export default MemberCard;