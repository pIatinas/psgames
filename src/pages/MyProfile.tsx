import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Camera, User } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import { userService, accountService } from '@/services/supabaseService';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';
const MyProfile: React.FC = () => {
  const {
    currentUser,
    updateCurrentUser
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    avatar_url: '',
    banner_url: ''
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's accounts
  const {
    data: accounts = []
  } = useQuery({
    queryKey: ['user-accounts', currentUser?.id],
    queryFn: () => accountService.getAll(),
    enabled: !!currentUser?.id
  });

  // Filter accounts where user has slots
  const userAccounts = accounts.filter(account => account.slots?.some(slot => slot.user_id === currentUser?.id));

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      // Load current user data into form
      setFormData({
        name: currentUser.name || '',
        avatar_url: currentUser.profile?.avatar_url || '',
        banner_url: (currentUser.profile as any)?.banner_url || ''
      });
      setProfileImage(currentUser.profile?.avatar_url || null);
      setBannerImage((currentUser.profile as any)?.banner_url || null);
    }
  }, [currentUser, navigate]);
  if (!currentUser) {
    return null;
  }
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setProfileImage(result);
        setFormData(prev => ({
          ...prev,
          avatar_url: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setBannerImage(result);
        setFormData(prev => ({
          ...prev,
          banner_url: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Update profile in Supabase
      const updatedProfile = await userService.updateProfile(currentUser.id, {
        name: formData.name,
        avatar_url: formData.avatar_url,
        banner_url: bannerImage || formData.banner_url,
        active: currentUser.active
      });

      // Update local user state
      const updatedUser = {
        ...currentUser,
        name: formData.name,
        profile: currentUser.profile ? {
          ...currentUser.profile,
          name: formData.name,
          avatar_url: formData.avatar_url
        } : undefined
      };
      if (updateCurrentUser) {
        updateCurrentUser(updatedUser);
      }
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o perfil.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handlePasswordChange = async () => {
    try {
      const {
        error
      } = await supabase.auth.resetPasswordForEmail(currentUser.email || '', {
        redirectTo: window.location.origin + '/login'
      });
      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível enviar o email de redefinição de senha.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Email enviado",
          description: "Verifique sua caixa de entrada para redefinir sua senha."
        });
      }
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao solicitar redefinição de senha.",
        variant: "destructive"
      });
    }
  };
  const defaultProfileImage = `https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=200&h=200&fit=crop&crop=face`;
  return <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container py-8">
        <SectionTitle title="Meu Perfil" subtitle="Gerencie suas informações pessoais" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-5 ">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input id="name" value={formData.name} onChange={e => setFormData(prev => ({
                    ...prev,
                    name: e.target.value
                  }))} placeholder="Seu nome completo" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatar_url">Avatar</Label>
                    <Input id="avatar_url" type="url" value={formData.avatar_url} onChange={e => setFormData(prev => ({
                    ...prev,
                    avatar_url: e.target.value
                  }))} placeholder="URL da imagem do seu avatar" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banner_url">Banner</Label>
                    <Input id="banner_url" type="url" value={formData.banner_url} onChange={e => setFormData(prev => ({
                    ...prev,
                    banner_url: e.target.value
                  }))} placeholder="URL da imagem do banner" />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={isLoading} className="bg-pink-600 hover:bg-pink-700">
                      {isLoading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Imagens do Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Avatar</Label>
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-24 w-24 rounded-full overflow-hidden bg-muted border">
                      <img src={formData.avatar_url || defaultProfileImage} alt="Avatar" className="h-full w-full object-cover" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Banner</Label>
                  <div className="flex flex-col items-center gap-4">
                     <div className="aspect-[3/1] w-full rounded-lg overflow-hidden bg-muted border">
                       {(formData.banner_url || bannerImage) ? <img src={bannerImage || formData.banner_url} alt="Banner" className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                           <div className="text-center">
                             <Camera className="h-12 w-12 mx-auto mb-2" />
                             <p>Preview do Banner</p>
                           </div>
                         </div>}
                     </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>;
};
export default MyProfile;