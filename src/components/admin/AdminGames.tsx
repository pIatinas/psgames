import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash, Gamepad2 } from 'lucide-react';
import { Game, GamePlatform } from '@/types';
import { games as gamesData } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

const AdminGames: React.FC = () => {
  const [games, setGames] = useState<Game[]>(gamesData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [formData, setFormData] = useState<Partial<Game>>({
    name: '',
    image: '',
    banner: '',
    platform: [],
    description: '',
    developer: '',
    genre: '',
    release_date: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (editingGame) {
      setFormData(editingGame);
    } else {
      setFormData({
        name: '',
        image: '',
        banner: '',
        platform: [],
        description: '',
        developer: '',
        genre: '',
        release_date: '',
      });
    }
  }, [editingGame]);

  const platforms: GamePlatform[] = ["PS5", "PS4", "PS3", "VITA"];

  const handleAddGame = () => {
    setEditingGame(null);
    setIsDialogOpen(true);
  };

  const handleEditGame = (game: Game) => {
    setEditingGame(game);
    setIsDialogOpen(true);
  };

  const handleDeleteGame = (gameId: string) => {
    setGames(games.filter(game => game.id !== gameId));
    toast({
      title: "Jogo removido",
      description: "O jogo foi removido com sucesso.",
    });
  };

  const handleSaveGame = () => {
    if (!formData.name || !formData.platform || formData.platform.length === 0) {
      toast({
        title: "Erro",
        description: "Nome e plataforma são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (editingGame) {
      // Update existing game
      const updatedGame = {
        ...editingGame,
        ...formData,
        updated_at: new Date().toISOString(),
      } as Game;
      
      setGames(games.map(game => 
        game.id === editingGame.id ? updatedGame : game
      ));
      
      toast({
        title: "Jogo atualizado",
        description: "O jogo foi atualizado com sucesso.",
      });
    } else {
      // Add new game
      const newGame: Game = {
        ...formData,
        id: `game-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Game;
      
      setGames([...games, newGame]);
      
      toast({
        title: "Jogo adicionado",
        description: "O jogo foi adicionado com sucesso.",
      });
    }

    setIsDialogOpen(false);
    setEditingGame(null);
  };

  const handlePlatformChange = (platform: GamePlatform, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        platform: [...(formData.platform || []), platform]
      });
    } else {
      setFormData({
        ...formData,
        platform: (formData.platform || []).filter(p => p !== platform)
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Jogos</h1>
          <p className="text-muted-foreground">Adicione, edite ou remova jogos do catálogo</p>
        </div>
        <Button onClick={handleAddGame}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Jogo
        </Button>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game) => (
          <Card key={game.id} className="overflow-hidden">
            <div className="aspect-[3/4] relative">
              {game.image ? (
                <img 
                  src={game.image} 
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Gamepad2 className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{game.name}</h3>
              <div className="flex flex-wrap gap-1 mb-3">
                {game.platform.map((platform) => (
                  <Badge key={platform} variant="secondary">
                    {platform}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditGame(game)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteGame(game.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Game Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingGame ? 'Editar Jogo' : 'Adicionar Novo Jogo'}
            </DialogTitle>
            <DialogDescription>
              {editingGame 
                ? 'Edite as informações do jogo abaixo.' 
                : 'Preencha as informações do novo jogo.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Jogo *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: God of War Ragnarök"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="image">URL da Imagem</Label>
              <Input
                id="image"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="banner">URL do Banner</Label>
              <Input
                id="banner"
                value={formData.banner || ''}
                onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                placeholder="https://exemplo.com/banner.jpg"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Plataformas *</Label>
              <div className="flex flex-wrap gap-4">
                {platforms.map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform}
                      checked={(formData.platform || []).includes(platform)}
                      onCheckedChange={(checked) => 
                        handlePlatformChange(platform, !!checked)
                      }
                    />
                    <Label htmlFor={platform}>{platform}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="developer">Desenvolvedor</Label>
              <Input
                id="developer"
                value={formData.developer || ''}
                onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                placeholder="Ex: Santa Monica Studio"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="genre">Gênero</Label>
              <Input
                id="genre"
                value={formData.genre || ''}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                placeholder="Ex: Ação, Aventura"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="release_date">Data de Lançamento</Label>
              <Input
                id="release_date"
                type="date"
                value={formData.release_date || ''}
                onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do jogo..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveGame}>
              {editingGame ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGames;
