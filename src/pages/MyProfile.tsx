
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Camera, User } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import { userService } from '@/services/supabaseService';

const MyProfile: React.FC = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [profileImage, setProfileImage] = useState<string | null>(currentUser?.profile?.avatar_url || null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
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
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBannerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (currentUser.profile) {
        const updatedProfile = await userService.updateProfile(currentUser.id, {
          name,
          avatar_url: profileImage || currentUser.profile.avatar_url,
        });

        const updatedUser = {
          ...currentUser,
          name,
          profile: updatedProfile
        };

        if (updateCurrentUser) {
          updateCurrentUser(updatedUser);
        }

        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram atualizadas com sucesso.",
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o perfil.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const defaultProfileImage = `https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=200&h=200&fit=crop&crop=face`;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container py-8">
        <SectionTitle 
          title="Meu Perfil" 
          subtitle="Gerencie suas informações pessoais"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      type="email"
                      value={currentUser.email || 'Email não disponível'} 
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">
                      O email não pode ser alterado
                    </p>
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
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
                  <Label htmlFor="profile-image">Imagem de Perfil</Label>
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full overflow-hidden bg-muted border">
                        <img 
                          src={profileImage || defaultProfileImage} 
                          alt="Perfil" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <label 
                        htmlFor="profile-image-input" 
                        className="absolute bottom-0 right-0 p-1 rounded-full bg-primary text-white cursor-pointer"
                      >
                        <Camera className="h-4 w-4" />
                        <input 
                          id="profile-image-input"
                          type="file" 
                          accept="image/*"
                          onChange={handleProfileImageChange}
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="banner-image">Banner do Perfil</Label>
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-full">
                      <div className="aspect-[3/1] w-full rounded-lg overflow-hidden bg-muted border">
                        {bannerImage ? (
                          <img 
                            src={bannerImage} 
                            alt="Banner" 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            <Camera className="h-12 w-12" />
                          </div>
                        )}
                      </div>
                      <label 
                        htmlFor="banner-image-input" 
                        className="absolute bottom-2 right-2 p-2 rounded-full bg-primary text-white cursor-pointer"
                      >
                        <Camera className="h-4 w-4" />
                        <input 
                          id="banner-image-input"
                          type="file" 
                          accept="image/*"
                          onChange={handleBannerImageChange}
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyProfile;
