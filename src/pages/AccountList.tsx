
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
import { accounts, games } from '@/data/mockData';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

const AccountList = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check authentication
  React.useEffect(() => {
    if (!currentUser) {
      toast({
        title: "Login necessário",
        description: "Você precisa fazer login para ver as contas",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [currentUser, navigate, toast]);
  
  const filteredAccounts = accounts.filter(account => {
    return account.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!currentUser) {
    return null; // Return nothing if not authenticated
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container py-8">
        <SectionTitle 
          title="Contas Disponíveis" 
          subtitle="Explore nossa coleção de contas com diversos jogos"
        />
        
        {/* Filtros */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar contas..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Grid de contas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAccounts.map(account => {
            const usedSlots = [account.slot1, account.slot2].filter(Boolean).length;
            const availableSlots = 2 - usedSlots;
            
            const statusColor = 
              availableSlots === 2 ? "bg-green-500" : 
              availableSlots === 1 ? "bg-blue-500" :
              "bg-red-500";
              
            // Get first game image for display
            const firstGame = account.games && account.games.length > 0 ? account.games[0] : null;
            
            return (
              <Link to={`/accounts/${account.id}`} key={account.id}>
                <Card className="overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-md">
                  <div className="relative">
                    {/* Status indicator */}
                    <div className={`absolute top-2 right-2 w-4 h-4 rounded-full ${statusColor} z-10`} />
                    
                    {/* Game image */}
                    <div className="aspect-[16/9] overflow-hidden">
                      <img 
                        src={firstGame?.image || '/placeholder.svg'} 
                        alt="Game Cover"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="p-3">
                    {/* Game info instead of account email */}
                    <div className="text-sm text-muted-foreground">
                      {account.games?.length || 0} jogos disponíveis
                    </div>
                    
                    {/* Show games list */}
                    <div className="mt-1">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {account.games?.map(game => game.name).join(', ') || "Sem jogos"}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
        
        {/* Mensagem quando não há contas */}
        {filteredAccounts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Nenhuma conta encontrada com os filtros atuais.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AccountList;
