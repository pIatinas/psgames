import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MemberCard from '@/components/MemberCard';
import SectionTitle from '@/components/SectionTitle';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { userService, accountService } from '@/services/supabaseService';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import Breadcrumbs from '@/components/Breadcrumbs';
const MemberList = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const {
    currentUser
  } = useAuth();

  // Fetch users from Supabase
  const {
    data: users = [],
    isLoading
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll()
  });

  // Fetch accounts to count active accounts per user
  const {
    data: accounts = []
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountService.getAll()
  });
  const filteredMembers = users.filter(user => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  if (isLoading) {
    return <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Loader />
        </main>
        <Footer />
      </div>;
  }
  return <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="container py-4">
          <Breadcrumbs />
        </div>
        
        <div className="container pb-8">
        <SectionTitle title="Membros Ativos" subtitle="Conheça os jogadores que fazem parte do nosso grupo" />
        
        {/* Filtros */}
        <div className="mb-8">
          <div className="relative mt-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Pesquisar membros..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
        
        {/* Grid de membros */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMembers.map(user => {
            const activeAccountsCount = accounts.filter(account => account.slots?.some(slot => slot.user_id === user.id)).length;
            return <MemberCard key={user.id} member={user} activeAccountsCount={activeAccountsCount} />;
          })}
        </div>
        
        {/* Mensagem quando não há membros */}
        {filteredMembers.length === 0 && <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Nenhum membro encontrado com os filtros atuais.
            </p>
          </div>}
        </div>
      </main>

      <Footer />
    </div>;
};
export default MemberList;