import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { userService, accountService } from '@/services/supabaseService';
import MemberProfileHeader from '@/components/member/MemberProfileHeader';
import MemberTrophyStats from '@/components/member/MemberTrophyStats';
import AccountUsageTimes from '@/components/member/AccountUsageTimes';
import MemberPaymentSidebar from '@/components/member/MemberPaymentSidebar';
import MemberAccountHistory from '@/components/member/MemberAccountHistory';
import MemberPaymentHistory from '@/components/member/MemberPaymentHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { parseMemberSlug } from '@/utils/gameUtils';
import { useQuery } from '@tanstack/react-query';
import { Member } from '@/types';
import Breadcrumbs from '@/components/Breadcrumbs';
const MemberDetail = () => {
  const {
    slug
  } = useParams<{
    slug: string;
  }>();

  // Extract member ID from slug
  const memberId = slug ? parseMemberSlug(slug) : null;

  // Fetch member data
  const {
    data: users = []
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll()
  });

  // Fetch accounts data
  const {
    data: accounts = []
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountService.getAll()
  });

  // Find the user
  const user = users.find(u => u.id === memberId);

  // Se o membro não for encontrado
  if (!user) {
    return <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container py-16 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Membro não encontrado</h2>
          <p className="text-white mb-6">Não foi possível encontrar o membro solicitado.</p>
          <Button asChild>
            <Link to="/members">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para membros
            </Link>
          </Button>
        </main>
        <Footer />
      </div>;
  }

  // Transform User to Member format for compatibility
  const member: Member = {
    id: user.id,
    name: user.name,
    email: user.email || '',
    password: '',
    psn_id: user.profile?.name || user.name,
    profile_image: user.profile?.avatar_url || '',
    isApproved: true,
    // Assume approved if they exist
    created_at: user.profile?.created_at || '',
    updated_at: user.profile?.updated_at || '',
    accounts: accounts.filter(account => account.slots?.some(slot => slot.user_id === user.id)),
    payments: [] // Empty for now
  };
  return <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground">Início</Link>
              <span className="text-muted-foreground">/</span>
              <Link to="/members" className="text-muted-foreground hover:text-foreground">Membros</Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground">{user.name}</span>
            </nav>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/members">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10 ">
            {/* Coluna principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Informações do perfil */}
              <MemberProfileHeader member={member} />
              
              {/* Troféus do PSN ID */}
              <MemberTrophyStats psnId={member.psn_id || member.name} />
              
              {/* Contas ativas com detalhes de jogos e tempo de uso */}
              <Card>
                <CardHeader>
                  <CardTitle>Contas Ativas</CardTitle>
                  
                </CardHeader>
                <CardContent>
                  <AccountUsageTimes accounts={accounts} memberId={memberId || ''} />
                </CardContent>
              </Card>

              {/* Member Account History */}
              <MemberAccountHistory accounts={accounts} memberId={memberId || ''} />
            </div>
            
            {/* Barra lateral */}
            <div className="space-y-6">
              {/* Payment Sidebar */}
              <MemberPaymentSidebar member={member} />
              
              {/* Informações do Status do Membro */}
              <Card>
                <CardHeader>
                  <CardTitle>Status do Membro</CardTitle>
                  <CardDescription>Informações sobre o status atual</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Status</div>
                    <Badge className={user.role === 'admin' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'}>
                      {user.role === 'admin' ? 'Administrador' : 'Membro'}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Membro desde</div>
                    <div className="text-sm text-muted-foreground">
                      {user.profile?.created_at ? new Date(user.profile.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>;
};
export default MemberDetail;