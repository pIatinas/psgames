import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Gamepad2, Calendar } from 'lucide-react';
import { Member } from '@/types';
interface MemberProfileHeaderProps {
  member: Member;
}
const MemberProfileHeader: React.FC<MemberProfileHeaderProps> = ({
  member
}) => {
  // Get member initials
  const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase();

  // Check current payment status
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentPayment = member.payments.find(p => p.month === currentMonth && p.year === currentYear);
  const paymentStatus = currentPayment ? currentPayment.status : 'pending';
  return <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
      <Avatar className="w-32 h-32">
        <AvatarImage src={member.profile_image} alt={member.name} />
        <AvatarFallback className="bg-accent/20 text-accent text-4xl">{initials}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-3xl font-bold text-white">{member.name}</h1>
        
        <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
          <Badge variant="secondary">
            Membro
          </Badge>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 text-sm text-muted-foreground -mt-1">
          
          
          <div className="flex items-center justify-center md:justify-start">
            
            <span>PSN ID: {member.psn_id}</span>
          </div>
          
          <div className="flex items-center justify-center md:justify-start">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Membro desde {new Date(member.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>;
};
export default MemberProfileHeader;