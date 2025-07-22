import React, { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Edit, Plus, Trash, Search } from 'lucide-react';
import { Game, GamePlatform } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { gameService, rawgService } from '@/services/supabaseService';

const AdminGames: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [games, setGames] = useState<Game[]>([]);
  const [newGame, setNewGame] = useState<Partial<Game>>({
    name: '',
    image: '',
    banner: '',
    platform: [],
    description: '',
    developer: '',
    genre: '',
    release_date: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [rawgResults, setRawgResults] = useState<any[]>([]);
  const [showRawgSearch, setShowRawgSearch] = useState(false);

  // Load games and check authentication
  useEffect(() => {
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
    } else {
      loadGames();
    }
  }, [currentUser, navigate, toast]);

  const loadGames = async () => {
    try {
      setLoading(true);
      const data = await gameService.getAll();
      setGames(data);
    } catch (error) {
      console.error('Error loading games:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar jogos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchRawgGames = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const results = await rawgService.searchGame(searchQuery);
      setRawgResults(results);
      setShowRawgSearch(true);
    } catch (error) {
      console.error('Error searching RAWG:', error);
      toast({
        title: "Erro",
        description: "Erro ao buscar jogos na API RAWG.",
        variant: "destructive",
      });
    }
  };

  const fillFromRawg = (rawgGame: any) => {
    setNewGame({
      name: rawgGame.name,
      image: rawgGame.background_image,
      banner: rawgGame.background_image,
      platform: rawgGame.platforms?.map((p: any) => {
        const platformName = p.platform.name;
        if (platformName.includes('PlayStation 5')) return 'PS5';
        if (platformName.includes('PlayStation 4')) return 'PS4';
        if (platformName.includes('PlayStation 3')) return 'PS3';
        if (platformName.includes('PS Vita')) return 'VITA';
        if (platformName.includes('PlayStation VR')) return 'VR';
        return platformName;
      }).filter((p: string) => ['PS5', 'PS4', 'PS3', 'VITA', 'VR'].includes(p)) || [],
      description: rawgGame.description_raw || '',
      developer: rawgGame.developers?.[0]?.name || '',
      genre: rawgGame.genres?.map((g: any) => g.name).join(', ') || '',
      release_date: rawgGame.released || '',
      rawg_id: rawgGame.id
    });
    setShowRawgSearch(false);
  };

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

  const handleSaveGame = async () => {
    if (!newGame.name) {
      toast({
        title: "Erro",
        description: "Nome do jogo é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isEditing && newGame.id) {
        // Update existing game
        const updatedGame = await gameService.update(newGame.id, newGame);
        setGames(games.map(game => 
          game.id === newGame.id ? updatedGame : game
        ));
        
        toast({
          title: "Jogo atualizado",
          description: "O jogo foi atualizado com sucesso.",
        });
      } else {
        // Add new game
        const gameToAdd = await gameService.create(newGame);
        setGames([...games, gameToAdd]);
        
        toast({
          title: "Jogo adicionado",
          description: "O jogo foi adicionado com sucesso.",
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
      setNewGame({ 
        name: '', 
        image: '', 
        banner: '', 
        platform: [], 
        description: '',
        developer: '',
        genre: '',
        release_date: ''
      });
      setIsEditing(false);
      setOpen(false);
    }
  };

  const handleEditGame = (game: Game) => {
    setNewGame(game);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteGame = async (id: string) => {
    try {
      await gameService.delete(id);
      setGames(games.filter(game => game.id !== id));
      
      toast({
        title: "Jogo excluído",
        description: "O jogo foi excluído com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir jogo:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o jogo.",
        variant: "destructive",
      });
    }
  };

  // Return null if not authenticated
  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Buscar jogos na API RAWG..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button onClick={searchRawgGames} variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Jogo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar Jogo' : 'Adicionar Novo Jogo'}</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do jogo abaixo.
              </DialogDescription>
            </DialogHeader>
            
            {showRawgSearch && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Resultados da busca RAWG:</h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {rawgResults.map((game, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{game.name}</p>
                        <p className="text-sm text-muted-foreground">{game.released}</p>
                      </div>
                      <Button size="sm" onClick={() => fillFromRawg(game)}>
                        Usar este jogo
                      </Button>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowRawgSearch(false)}
                  className="mt-2"
                >
                  Fechar resultados
                </Button>
              </div>
            )}
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome *</Label>
                <Input 
                  id="name" 
                  value={newGame.name || ''} 
                  onChange={(e) => setNewGame({...newGame, name: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="image">URL da Imagem</Label>
                <Input 
                  id="image" 
                  value={newGame.image || ''} 
                  onChange={(e) => setNewGame({...newGame, image: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="banner">URL do Banner</Label>
                <Input 
                  id="banner" 
                  value={newGame.banner || ''} 
                  onChange={(e) => setNewGame({...newGame, banner: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  value={newGame.description || ''} 
                  onChange={(e) => setNewGame({...newGame, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="developer">Desenvolvedor</Label>
                  <Input 
                    id="developer" 
                    value={newGame.developer || ''} 
                    onChange={(e) => setNewGame({...newGame, developer: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="genre">Gênero</Label>
                  <Input 
                    id="genre" 
                    value={newGame.genre || ''} 
                    onChange={(e) => setNewGame({...newGame, genre: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="release_date">Data de Lançamento</Label>
                <Input 
                  id="release_date" 
                  type="date"
                  value={newGame.release_date || ''} 
                  onChange={(e) => setNewGame({...newGame, release_date: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Plataformas</Label>
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
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setOpen(false);
                setNewGame({ 
                  name: '', 
                  image: '', 
                  banner: '', 
                  platform: [], 
                  description: '',
                  developer: '',
                  genre: '',
                  release_date: ''
                });
                setIsEditing(false);
                setShowRawgSearch(false);
              }}>
                Cancelar
              </Button>
              <Button onClick={handleSaveGame} disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Plataformas</TableHead>
              <TableHead>Desenvolvedor</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Carregando jogos...
                </TableCell>
              </TableRow>
            ) : games.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhum jogo encontrado
                </TableCell>
              </TableRow>
            ) : (
              games.map(game => (
                <TableRow key={game.id}>
                  <TableCell className="font-medium">{game.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {game.platform.map(platform => {
                        const colorMap: Record<string, string> = {
                          "PS5": "bg-blue-500 text-white",
                          "PS4": "bg-indigo-500 text-white",
                          "PS3": "bg-purple-500 text-white",
                          "VITA": "bg-green-500 text-white",
                          "VR": "bg-red-500 text-white"
                        };
                        
                        return (
                          <span key={platform} className={`px-2 py-1 text-xs rounded-full ${colorMap[platform] || 'bg-gray-500 text-white'}`}>
                            {platform}
                          </span>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>{game.developer || '-'}</TableCell>
                  <TableCell>{new Date(game.created_at).toLocaleDateString()}</TableCell>
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminGames;