
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { gameService, accountService } from '@/services/supabaseService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Game, GamePlatform } from '@/types';
import ImagePlaceholder from '@/components/ui/image-placeholder';

interface AdminGamesProps {
  onOpenModal?: () => void;
}

const AdminGames: React.FC<AdminGamesProps> = ({ onOpenModal }) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [deleteGameId, setDeleteGameId] = useState<string | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    banner: '',
    platform: [] as GamePlatform[],
    description: '',
    developer: '',
    genre: '',
    release_date: ''
  });

  const { data: games = [], isLoading: gamesLoading } = useQuery({
    queryKey: ['admin-games'],
    queryFn: () => gameService.getAll()
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ['admin-accounts'],
    queryFn: () => accountService.getAll()
  });

  React.useEffect(() => {
    const handleOpenModal = () => {
      resetForm();
      setIsDialogOpen(true);
    };
    
    window.addEventListener('openGameModal', handleOpenModal);
    
    return () => {
      window.removeEventListener('openGameModal', handleOpenModal);
    };
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      image: '',
      banner: '',
      platform: [] as GamePlatform[],
      description: '',
      developer: '',
      genre: '',
      release_date: ''
    });
    setSelectedAccounts([]);
    setEditingGame(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setFormData({
      name: game.name,
      image: game.image,
      banner: game.banner,
      platform: game.platform,
      description: game.description,
      developer: game.developer,
      genre: game.genre,
      release_date: game.release_date
    });

    const gameAccountIds = accounts
      .filter(account => account.games?.some(g => g.id === game.id))
      .map(account => account.id);
    setSelectedAccounts(gameAccountIds);
    setIsDialogOpen(true);
  };

  const handleAccountToggle = (accountId: string) => {
    setSelectedAccounts(prev =>
      prev.includes(accountId)
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image || !formData.banner) {
      toast({
        title: "Erro",
        description: "Nome, imagem e banner são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingGame) {
        // Update existing game
        await gameService.update(editingGame.id, {
          name: formData.name,
          image: formData.image,
          banner: formData.banner,
          platform: formData.platform,
          description: formData.description,
          developer: formData.developer,
          genre: formData.genre,
          release_date: formData.release_date
        });

        // Link to accounts
        await gameService.linkToAccounts(editingGame.id, selectedAccounts);

        toast({
          title: "Jogo atualizado",
          description: "O jogo foi atualizado com sucesso."
        });
      } else {
        // Create new game
        const newGame = await gameService.create({
          name: formData.name,
          image: formData.image,
          banner: formData.banner,
          platform: formData.platform,
          description: formData.description,
          developer: formData.developer,
          genre: formData.genre,
          release_date: formData.release_date,
          rawg_id: 0
        });

        if (newGame) {
          // Link to accounts
          await gameService.linkToAccounts(newGame.id, selectedAccounts);
        }

        toast({
          title: "Jogo criado",
          description: "O novo jogo foi criado com sucesso."
        });
      }
      queryClient.invalidateQueries({ queryKey: ['admin-games'] });
      queryClient.invalidateQueries({ queryKey: ['admin-accounts'] });
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o jogo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteGameId) return;

    try {
      const success = await gameService.delete(deleteGameId);
      if (success) {
        // Remove from local state immediately
        queryClient.setQueryData(['admin-games'], (oldData: Game[] | undefined) => 
          oldData ? oldData.filter(game => game.id !== deleteGameId) : []
        );
        queryClient.invalidateQueries({ queryKey: ['admin-games'] });
        toast({
          title: "Jogo excluído",
          description: "O jogo foi excluído com sucesso."
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o jogo.",
        variant: "destructive"
      });
    } finally {
      setDeleteGameId(null);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  if (gamesLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Carregando jogos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with title */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Jogos</h2>
      </div>

      {/* Games Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Plataforma</TableHead>
              <TableHead>Contas</TableHead>
              {/* <TableHead>Desenvolvedor</TableHead> */}
              {isAdmin && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map(game => {
              const gameAccounts = accounts.filter(account => 
                account.games?.some(g => g.id === game.id)
              );
              
              return (
                <TableRow key={game.id}>
                  <TableCell>
                    <div className="w-12 h-12 rounded overflow-hidden bg-muted">
                      <ImagePlaceholder 
                        src={game.image} 
                        alt={game.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{game.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {game.platform.map(platform => (
                        <Badge key={platform} variant="secondary" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {gameAccounts.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {gameAccounts.slice(0, 2).map(account => (
                          <Badge key={account.id} variant="outline" className="text-xs">
                            {account.email}
                          </Badge>
                        ))}
                        {gameAccounts.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{gameAccounts.length - 2}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Nenhuma conta</span>
                    )}
                  </TableCell>
                  {/* <TableCell>{game.developer}</TableCell> */}
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.location.href = `/games/${game.id}`}
                          className="hover:bg-white hover:text-gray-900"
                        >
                          Ver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(game)}
                          className="hover:bg-white hover:text-gray-900"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => setDeleteGameId(game.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Game Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingGame ? 'Editar Jogo' : 'Cadastrar Jogo'}
            </DialogTitle>
            <DialogDescription>
              {editingGame ? 'Edite as informações do jogo.' : 'Adicione um novo jogo à biblioteca.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="image">URL da Imagem *</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="banner">URL do Banner *</Label>
                <Input
                  id="banner"
                  type="url"
                  value={formData.banner}
                  onChange={e => setFormData(prev => ({ ...prev, banner: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="developer">Desenvolvedor</Label>
                <Input
                  id="developer"
                  value={formData.developer}
                  onChange={e => setFormData(prev => ({ ...prev, developer: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="genre">Gênero</Label>
                <Input
                  id="genre"
                  value={formData.genre}
                  onChange={e => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="release_date">Data de Lançamento</Label>
                <Input
                  id="release_date"
                  type="date"
                  value={formData.release_date}
                  onChange={e => setFormData(prev => ({ ...prev, release_date: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label>Plataformas</Label>
              <div className="flex flex-wrap gap-2">
                {['PS5', 'PS4', 'PS3', 'VITA'].map(platform => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={`platform-${platform}`}
                      checked={formData.platform.includes(platform as GamePlatform)}
                      onCheckedChange={checked => {
                        setFormData(prev => ({
                          ...prev,
                          platform: checked
                            ? [...prev.platform, platform as GamePlatform]
                            : prev.platform.filter(p => p !== platform)
                        }));
                      }}
                    />
                    <Label htmlFor={`platform-${platform}`} className="cursor-pointer">{platform}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Contas Vinculadas</Label>
              <div className="text-sm text-muted-foreground">
                Selecione as contas que possuem este jogo
              </div>
              <div className="max-h-48 overflow-y-auto border rounded p-2">
                {accounts.map(account => (
                  <div key={account.id} className="flex items-center space-x-2 p-1">
                    <Checkbox
                      id={`account-${account.id}`}
                      checked={selectedAccounts.includes(account.id)}
                      onCheckedChange={() => handleAccountToggle(account.id)}
                    />
                    <Label htmlFor={`account-${account.id}`} className="cursor-pointer">
                      {account.email}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (editingGame ? "Atualizando..." : "Criando...") : (editingGame ? 'Atualizar' : 'Criar')} Jogo
              </Button>
            </DialogFooter>
          </form>
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
