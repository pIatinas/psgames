
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { accounts } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';
import SectionTitle from '@/components/SectionTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, Game, Check, X } from 'lucide-react';
import { Account } from '@/types';

const MyAccounts: React.FC = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser || !currentUser.member) {
    return null;
  }

  // Get active accounts for the current member
  const activeAccounts = accounts.filter(account => {
    return (
      (account.slot1 && account.slot1.member.id === currentUser.member?.id) ||
      (account.slot2 && account.slot2.member.id === currentUser.member?.id)
    );
  });

  // Get slot information for a specific account
  const getMemberSlot = (account: Account) => {
    if (account.slot1?.member.id === currentUser.member?.id) {
      return { slotNumber: 1, data: account.slot1 };
    } else if (account.slot2?.member.id === currentUser.member?.id) {
      return { slotNumber: 2, data: account.slot2 };
    }
    return null;
  };

  const calculateDaysUsing = (enteredDate: Date) => {
    const now = new Date();
    const entered = new Date(enteredDate);
    const diffTime = Math.abs(now.getTime() - entered.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleReleaseAccount = (account: Account) => {
    const slot = getMemberSlot(account);
    
    if (slot) {
      // Remove member from slot (in a real app, this would be an API call)
      if (slot.slotNumber === 1) {
        account.slot1 = undefined;
      } else {
        account.slot2 = undefined;
      }
      
      toast({
        title: "Conta devolvida",
        description: "Você devolveu a conta com sucesso.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container py-8">
        <SectionTitle 
          title="Minhas Contas" 
          subtitle={`${activeAccounts.length} ${activeAccounts.length === 1 ? 'conta em uso' : 'contas em uso'}`}
        />
        
        {activeAccounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeAccounts.map(account => {
              const slot = getMemberSlot(account);
              const daysUsing = slot?.data ? calculateDaysUsing(slot.data.entered_at) : 0;
              
              return (
                <Card key={account.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {account.email.split('@')[0]}
                        </h3>
                        <div className="flex items-center text-sm text-white mt-1">
                          <CalendarClock className="h-4 w-4 mr-1" />
                          <span>
                            Ativada em {new Date(slot?.data?.entered_at || '').toLocaleDateString()}
                          </span>
                          <Badge variant="outline" className="ml-2">
                            {daysUsing} {daysUsing === 1 ? 'dia' : 'dias'} de uso
                          </Badge>
                        </div>
                      </div>
                      
                      <Badge className={slot?.slotNumber === 1 ? "bg-red-500" : "bg-red-500"}>
                        Slot {slot?.slotNumber}
                      </Badge>
                    </div>
                    
                    {account.games && account.games.length > 0 && (
                      <div className="mt-4">
                        <div className="text-sm font-medium mb-2 text-white flex items-center">
                          <Game className="h-4 w-4 mr-1" />
                          Jogos disponíveis
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {account.games.map(game => (
                            <Badge key={game.id} variant="outline" className="text-white">
                              {game.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="bg-gray-800/20 p-4">
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => handleReleaseAccount(account)}
                    >
                      Devolver Conta
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-white mb-4">
              Você não está utilizando nenhuma conta no momento.
            </p>
            <Button onClick={() => navigate('/accounts')}>
              Ver contas disponíveis
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyAccounts;
