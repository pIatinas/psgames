import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Plus, Trash } from 'lucide-react';
import { Game, GamePlatform, Account } from '@/types';
import { games as gamesData, accounts as accountsData } from '@/data/mockData';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { enrichGameWithExternalInfo } from '@/services/gameInfoService';

const AdminGames: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [games, setGames] = useState<Game[]>(gamesData);
  const [accounts, setAccounts] = useState<Account[]>(accountsData);
  const [newGame, setNewGame] = useState<Partial<Game>>({
    name: '',
    image: '',
    banner: '',
    platform: [],
    referenceLink: ''
  });
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if not admin
  React.useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para acessar esta área.",
        variant: "destructive",
      });
      navigate('/');
    } else if (!currentUser) {
      toast({
        title: "Login Necessário",
        description: "Faça login para acessar esta área.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [currentUser, navigate, toast]);

  const platformOptions: GamePlatform[] = ["PS5", "PS4", "PS3", "VITA", "VR"];

  const handlePlatformToggle = (platform: GamePlatform) => {
    const platforms = [...(newGame.platform || [])];
    if (platforms.includes(platform)) {
      setNewGame({
        ...newGame,
        platform: platforms.filter(p => p !== platform)
      });
    } else {
      setNewGame({
        ...newGame,
        platform: [...platforms, platform]
      });
    }
  };

  const handleAccountToggle = (accountId: string) => {
    if (selectedAccounts.includes(accountId)) {
      setSelectedAccounts(selectedAccounts.filter(id => id !== accountId));
    } else {
      setSelectedAccounts([...selectedAccounts, accountId]);
    }
  };

  const handleSaveGame = async () => {
    setLoading(true);
    try {
      // Enriquecer o jogo com informações externas
      const enrichedGame = await enrichGameWithExternalInfo(newGame);
      
      if (isEditing && newGame.id) {
        // Update existing game
        const updatedGame = {
          ...games.find(game => game.id === newGame.id),
          ...enrichedGame
        } as Game;

        // Link game to selected accounts
        const updatedAccounts = accounts.map(account => {
          if (selectedAccounts.includes(account.id)) {
            // Add game to account if not already there
            const existingGames = account.games || [];
            if (!existingGames.find(g => g.id === updatedGame.id)) {
              return {
                ...account,
                games: [...existingGames, updatedGame]
              };
            }
          } else {
            // Remove game from account if previously linked
            if (account.games?.some(g => g.id === updatedGame.id)) {
              return {
                ...account,
                games: account.games.filter(g => g.id !== updatedGame.id)
              };
            }
          }
          return account;
        });

        setGames(games.map(game => 
          game.id === newGame.id ? updatedGame : game
        ));
        setAccounts(updatedAccounts);
        
        toast({
          title: "Jogo atualizado",
          description: "O jogo foi atualizado com sucesso.",
        });
      } else {
        // Add new game
        const gameToAdd = {
          ...enrichedGame,
          id: `game-${Date.now()}`,
          created_at: new Date(),
        } as Game;

        // Link game to selected accounts
        const updatedAccounts = accounts.map(account => {
          if (selectedAccounts.includes(account.id)) {
            return {
              ...account,
              games: [...(account.games || []), gameToAdd]
            };
          }
          return account;
        });

        setGames([...games, gameToAdd]);
        setAccounts(updatedAccounts);
        
        toast({
          title: "Jogo adicionado",
          description: "O jogo foi adicionado com sucesso e informações externas foram buscadas.",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar jogo:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o jogo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      
      // Reset form
      setNewGame({ name: '', image: '', banner: '', platform: [], referenceLink: '' });
      setSelectedAccounts([]);
      setIsEditing(false);
      setOpen(false);
    }
  };

  const handleEditGame = (game: Game) => {
    setNewGame(game);
    // Set selected accounts for this game
    setSelectedAccounts(
      accounts
        .filter(account => account.games?.some(g => g.id === game.id))
        .map(account => account.id)
    );
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteGame = (id: string) => {
    // Remove game from all accounts
    const updatedAccounts = accounts.map(account => {
      if (account.games?.some(g => g.id === id)) {
        return {
          ...account,
          games: account.games.filter(g => g.id !== id)
        };
      }
      return account;
    });

    setGames(games.filter(game => game.id !== id));
    setAccounts(updatedAccounts);
    
    toast({
      title: "Jogo excluído",
      description: "O jogo foi excluído com sucesso.",
    });
  };

  // Return null if not authenticated or loading
  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Jogo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-white">{isEditing ? 'Editar Jogo' : 'Adicionar Novo Jogo'}</DialogTitle>
              <DialogDescription className="text-white">
                Preencha os detalhes do jogo abaixo.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-white">Nome</Label>
                <Input 
                  id="name" 
                  value={newGame.name} 
                  onChange={(e) => setNewGame({...newGame, name: e.target.value})}
                  className="text-white"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="image" className="text-white">URL da Imagem</Label>
                <Input 
                  id="image" 
                  value={newGame.image} 
                  onChange={(e) => setNewGame({...newGame, image: e.target.value})}
                  className="text-white"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="banner" className="text-white">URL do Banner</Label>
                <Input 
                  id="banner" 
                  value={newGame.banner} 
                  onChange={(e) => setNewGame({...newGame, banner: e.target.value})}
                  className="text-white"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="referenceLink" className="text-white">Link de Referência</Label>
                <Input 
                  id="referenceLink" 
                  value={newGame.referenceLink || ''} 
                  onChange={(e) => setNewGame({...newGame, referenceLink: e.target.value})}
                  className="text-white"
                  placeholder="https://www.psnprofiles.com/game/xxxx"
                />
              </div>
              
              <div className="grid gap-2">
                <Label className="text-white">Plataformas</Label>
                <div className="flex flex-wrap gap-2">
                  {platformOptions.map(platform => (
                    <Button
                      key={platform}
                      type="button"
                      variant={newGame.platform?.includes(platform) ? "default" : "outline"}
                      onClick={() => handlePlatformToggle(platform)}
                      size="sm"
                    >
                      {platform}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label className="text-white">Contas Vinculadas</Label>
                <div className="max-h-48 overflow-y-auto border rounded-md p-2">
                  {accounts.map(account => (
                    <div key={account.id} className="flex items-center space-x-2 py-1">
                      <Checkbox 
                        id={`account-${account.id}`}
                        checked={selectedAccounts.includes(account.id)}
                        onCheckedChange={() => handleAccountToggle(account.id)}
                      />
                      <Label htmlFor={`account-${account.id}`} className="cursor-pointer text-white">
                        {account.email}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setOpen(false);
                setNewGame({ name: '', image: '', banner: '', platform: [], referenceLink: '' });
                setSelectedAccounts([]);
                setIsEditing(false);
              }}>
                Cancelar
              </Button>
              <Button onClick={handleSaveGame} disabled={loading}>
                {loading ? "Buscando informações..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Nome</TableHead>
              <TableHead className="text-white">Plataformas</TableHead>
              <TableHead className="text-white">Contas</TableHead>
              <TableHead className="text-white">Data de Criação</TableHead>
              <TableHead className="text-right text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map(game => {
              // Get accounts that have this game
              const gameAccounts = accounts.filter(account => 
                account.games?.some(g => g.id === game.id)
              );
              
              return (
                <TableRow key={game.id}>
                  <TableCell className="font-medium text-white">{game.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {game.platform.map(platform => {
                        const colorMap: Record<GamePlatform, string> = {
                          "PS5": "bg-blue-500 text-white",
                          "PS4": "bg-indigo-500 text-white",
                          "PS3": "bg-purple-500 text-white",
                          "VITA": "bg-green-500 text-white",
                          "VR": "bg-red-500 text-white"
                        };
                        
                        return (
                          <span key={platform} className={`px-2 py-1 text-xs rounded-full ${colorMap[platform]}`}>
                            {platform}
                          </span>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {gameAccounts.length > 0 ? (
                        gameAccounts.slice(0, 3).map(account => (
                          <span key={account.id} className="px-2 py-1 text-xs bg-secondary rounded-full text-white">
                            {account.email}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-white">Sem contas</span>
                      )}
                      {gameAccounts.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-secondary rounded-full text-white">
                          +{gameAccounts.length - 3} mais
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-white">{new Date(game.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditGame(game)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteGame(game.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminGames;
