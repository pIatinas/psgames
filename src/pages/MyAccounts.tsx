import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import SectionTitle from '@/components/SectionTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, GamepadIcon, Eye, X } from 'lucide-react';
import { Account } from '@/types';
import { accountService } from '@/services/supabaseService';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

const MyAccounts: React.FC = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Load user accounts
  useEffect(() => {
    const loadAccounts = async () => {
      if (!currentUser) return;
      
      try {
        const allAccounts = await accountService.getAll();
        const userAccounts = allAccounts.filter(account => 
          account.slots?.some(slot => slot.user_id === currentUser.id)
        );
        setAccounts(userAccounts);
      } catch (error) {
        console.error('Erro ao carregar contas:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas contas.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, [currentUser, toast]);

  if (!currentUser) {
    return null;
  }

  // Get slot information for a specific account
  const getMemberSlot = (account: Account) => {
    const slot = account.slots?.find(slot => slot.user_id === currentUser.id);
    return slot ? { slotNumber: slot.slot_number, data: slot } : null;
  };

  const calculateDaysUsing = (enteredDate: string) => {
    const now = new Date();
    const entered = new Date(enteredDate);
    const diffTime = Math.abs(now.getTime() - entered.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleReleaseAccount = async (account: Account) => {
    if (!currentUser) return;
    
    try {
      const slot = account.slots?.find(s => s.user_id === currentUser.id);
      if (slot) {
        await accountService.freeSlot(account.id, slot.slot_number);
        
        // Update local state
        setAccounts(accounts.filter(acc => acc.id !== account.id));
        
        toast({
          title: "Conta devolvida",
          description: "Você devolveu a conta com sucesso.",
        });
      }
    } catch (error) {
      console.error('Erro ao devolver conta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível devolver a conta.",
        variant: "destructive",
      });
    }
  };

  const defaultAccountImage = `https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=300&fit=crop`;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">Carregando suas contas...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container py-8">
        <SectionTitle 
          title="Minhas Contas" 
          subtitle={`${accounts.length} ${accounts.length === 1 ? 'conta em uso' : 'contas em uso'}`}
        />
        
        {accounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accounts.map(account => {
              const slot = getMemberSlot(account);
              const daysUsing = slot?.data ? calculateDaysUsing(slot.data.entered_at || '') : 0;
              
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
                            Ativada em {new Date(slot?.data?.entered_at || '').toLocaleDateString('pt-BR')}
                          </span>
                          <Badge variant="outline" className="ml-2">
                            {daysUsing} {daysUsing === 1 ? 'dia' : 'dias'} de uso
                          </Badge>
                        </div>
                      </div>
                      
                      <Badge className="bg-blue-500">
                        Slot {slot?.slotNumber}
                      </Badge>
                    </div>
                    
                    {account.games && account.games.length > 0 && (
                      <div className="mt-4">
                        <div className="text-sm font-medium mb-2 text-white flex items-center">
                          <GamepadIcon className="h-4 w-4 mr-1" />
                          Jogos disponíveis ({account.games.length})
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                          {account.games.slice(0, 3).map(game => (
                            <Badge key={game.id} variant="outline" className="text-white">
                              {game.name}
                            </Badge>
                          ))}
                          {account.games.length > 3 && (
                            <Badge variant="outline" className="text-white">
                              +{account.games.length - 3} mais
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="bg-gray-800/20 p-4 flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setSelectedAccount(account)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detalhes da Conta</DialogTitle>
                          <DialogDescription>
                            Informações de acesso para {selectedAccount?.email}
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedAccount && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Credenciais de Acesso</h4>
                                <div className="space-y-2">
                                  <div>
                                    <label className="text-sm font-medium">Email:</label>
                                    <div className="p-2 bg-muted rounded text-sm">{selectedAccount.email}</div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Senha:</label>
                                    <div className="p-2 bg-muted rounded text-sm">
                                      {selectedAccount.password ? '••••••••' : 'Não definida'}
                                    </div>
                                  </div>
                                  {selectedAccount.codes && (
                                    <div>
                                      <label className="text-sm font-medium">Códigos:</label>
                                      <div className="p-2 bg-muted rounded text-sm">{selectedAccount.codes}</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">QR Code</h4>
                                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                                  <img 
                                    src={selectedAccount.qr_code || defaultAccountImage} 
                                    alt="QR Code" 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {selectedAccount.games && selectedAccount.games.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Jogos Disponíveis</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                  {selectedAccount.games.map(game => (
                                    <div key={game.id} className="p-2 bg-muted rounded text-sm">
                                      {game.name}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => handleReleaseAccount(account)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Devolver
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
