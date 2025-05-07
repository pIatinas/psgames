
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { members, accounts } from '@/data/mockData';
import MemberProfileHeader from '@/components/member/MemberProfileHeader';
import MemberActiveAccounts from '@/components/member/MemberActiveAccounts';
import MemberPaymentSidebar from '@/components/member/MemberPaymentSidebar';
import MemberNotFound from '@/components/member/MemberNotFound';

const MemberDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Encontrar o membro pelo ID
  const member = members.find(member => member.id === id);
  
  // Se o membro não for encontrado
  if (!member) {
    return <MemberNotFound />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <div className="container py-8">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              className="mr-4 text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link to="/members">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Informações do perfil */}
              <MemberProfileHeader member={member} />
              
              {/* Contas ativas */}
              <MemberActiveAccounts accounts={accounts} memberId={id || ''} />
            </div>
            
            {/* Barra lateral */}
            <div>
              {/* Histórico de pagamentos */}
              <MemberPaymentSidebar member={member} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MemberDetail;
