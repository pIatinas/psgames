
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash } from 'lucide-react';
import { Game, GamePlatform } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { gameService, accountService } from '@/services/supabaseService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import ImagePlaceholder from '@/components/ui/image-placeholder';

const AdminGames: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [deleteGameId, setDeleteGameId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Game>>({
    name: '',
    description: '',
    image: '',
    banner: '',
    platform: [],
    developer: '',
    genre: '',
    release_date: '',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const { data: games = [], isLoading } = useQuery({
    queryKey: ['admin-games'],
    queryFn: () => gameService.getAll(),
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ['admin-accounts'],
    queryFn: () => accountService.getAll(),
  });

  useEffect(() => {
    if (editingGame) {
      setFormData(editingGame);
    } else {
      setFormData({
        name: '',
        description: '',
        image: '',
        banner: '',
        platform: [],
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

  const handleDeleteConfirm = async () => {
    if (!deleteGameId) return;
    
    const success = await gameService.delete(deleteGameId);
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['admin-games'] });
      toast({
        title: "Jogo removido",
        description: "O jogo foi removido com sucesso.",
      });
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível remover o jogo.",
        variant: "destructive",
      });
    }
    setDeleteGameId(null);
  };

  const handleSaveGame = async () => {
    if (!formData.name || !formData.platform || formData.platform.length === 0) {
      toast({
        title: "Erro",
        description: "Nome e plataforma são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    let result;
    if (editingGame) {
      result = await gameService.update(editingGame.id, formData);
    } else {
      result = await gameService.create(formData as Omit<Game, 'id' | 'created_at' | 'updated_at'>);
    }

    if (result) {
      queryClient.invalidateQueries({ queryKey: ['admin-games'] });
      toast({
        title: editingGame ? "Jogo atualizado" : "Jogo adicionado",
        description: editingGame ? "O jogo foi atualizado com sucesso." : "O jogo foi adicionado com sucesso.",
      });
      setIsDialogOpen(false);
      setEditingGame(null);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o jogo.",
        variant: "destructive",
      });
    }
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

  const isAdmin = currentUser?.role === 'admin';

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Carregando jogos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div />
        {isAdmin && (
          <Button onClick={handleAddGame}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Jogo
          </Button>
        )}
      </div>

      {/* Games Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Plataformas</TableHead>
              <TableHead>Desenvolvedor</TableHead>
              <TableHead>Gênero</TableHead>
              {isAdmin && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.id}>
                <TableCell>
                  <div className="w-12 h-12">
                    <ImagePlaceholder
                      src={game.image}
                      alt={game.name}
                      className="w-full h-full object-cover rounded aspect-square"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{game.name}</TableCell>
                <TableCell className="max-w-xs">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {game.description}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {game.platform.map((platform) => (
                      <Badge key={platform} variant="secondary" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{game.developer}</TableCell>
                <TableCell>{game.genre}</TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditGame(game)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteGameId(game.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do jogo..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
            
            <div className="grid grid-cols-2 gap-4">
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
              <Label>Contas</Label>
              <div className="text-sm text-muted-foreground">
                Vincule este jogo às contas onde ele está disponível
              </div>
              <div className="max-h-32 overflow-y-auto border rounded p-2">
                {accounts.map((account) => (
                  <div key={account.id} className="flex items-center space-x-2 py-1">
                    <Checkbox id={`account-${account.id}`} />
                    <Label htmlFor={`account-${account.id}`} className="text-sm">
                      {account.email}
                    </Label>
                  </div>
                ))}
              </div>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteGameId} onOpenChange={() => setDeleteGameId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este jogo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminGames;
