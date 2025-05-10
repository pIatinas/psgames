import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MemberCard from '@/components/MemberCard';
import SectionTitle from '@/components/SectionTitle';
import { members } from '@/data/mockData';
import { Search, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

const MemberList = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showApprovedOnly, setShowApprovedOnly] = React.useState(true);
  const { currentUser } = useAuth();
  
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.psn_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesApproval = showApprovedOnly ? member.isApproved : true;
    return matchesSearch && matchesApproval;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container py-8">
        <SectionTitle 
          title="Membros da Comunidade" 
          subtitle="Conheça os jogadores que fazem parte da nossa comunidade"
        />
        
        {/* Filtros */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-start">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar membros..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="approved-only"
              checked={showApprovedOnly}
              onCheckedChange={setShowApprovedOnly}
            />
            <Label htmlFor="approved-only" className="flex items-center gap-1">
              <UserCheck className="h-4 w-4" />
              Mostrar apenas aprovados
            </Label>
          </div>
        </div>
        
        {/* Grid de membros */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMembers.map(member => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
        
        {/* Mensagem quando não há membros */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Nenhum membro encontrado com os filtros atuais.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MemberList;
