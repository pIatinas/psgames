
import React, { useState } from 'react';
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
import { Game, GamePlatform } from '@/types';
import { mockGames } from '@/data/mockData';

const AdminGames: React.FC = () => {
  const [games, setGames] = useState<Game[]>(mockGames);
  const [newGame, setNewGame] = useState<Partial<Game>>({
    name: '',
    image: '',
    banner: '',
    platform: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  const platformOptions: GamePlatform[] = ["PS5", "PS4", "PS3", "PC", "VITA", "VR"];

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

  const handleSaveGame = () => {
    if (isEditing && newGame.id) {
      // Update existing game
      setGames(games.map(game => 
        game.id === newGame.id ? { ...game, ...newGame } as Game : game
      ));
    } else {
      // Add new game
      const gameToAdd = {
        ...newGame,
        id: `game-${Date.now()}`,
        created_at: new Date(),
      } as Game;
      setGames([...games, gameToAdd]);
    }
    
    // Reset form
    setNewGame({ name: '', image: '', banner: '', platform: [] });
    setIsEditing(false);
    setOpen(false);
  };

  const handleEditGame = (game: Game) => {
    setNewGame(game);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteGame = (id: string) => {
    setGames(games.filter(game => game.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-pink-500">Gerenciar Jogos</h2>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Jogo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar Jogo' : 'Adicionar Novo Jogo'}</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do jogo abaixo.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input 
                  id="name" 
                  value={newGame.name} 
                  onChange={(e) => setNewGame({...newGame, name: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="image">URL da Imagem</Label>
                <Input 
                  id="image" 
                  value={newGame.image} 
                  onChange={(e) => setNewGame({...newGame, image: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="banner">URL do Banner</Label>
                <Input 
                  id="banner" 
                  value={newGame.banner} 
                  onChange={(e) => setNewGame({...newGame, banner: e.target.value})}
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
                setNewGame({ name: '', image: '', banner: '', platform: [] });
                setIsEditing(false);
              }}>
                Cancelar
              </Button>
              <Button onClick={handleSaveGame}>Salvar</Button>
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
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map(game => (
              <TableRow key={game.id}>
                <TableCell className="font-medium">{game.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {game.platform.map(platform => {
                      const colorMap: Record<GamePlatform, string> = {
                        "PS5": "bg-blue-500 text-white",
                        "PS4": "bg-indigo-500 text-white",
                        "PS3": "bg-purple-500 text-white",
                        "PC": "bg-gray-800 text-white",
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminGames;
