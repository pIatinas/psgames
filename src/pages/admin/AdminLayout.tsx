import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AdminGames from '@/components/admin/AdminGames';
import AdminAccounts from '@/components/admin/AdminAccounts';
import AdminMembers from '@/components/admin/AdminMembers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
const AdminLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = React.useState('games');

  const handleCreateClick = () => {
    // Trigger the respective modal based on current tab
    if (currentTab === 'games') {
      window.dispatchEvent(new CustomEvent('openGameModal'));
    } else if (currentTab === 'accounts') {
      window.dispatchEvent(new CustomEvent('openAccountModal'));
    } else if (currentTab === 'members') {
      window.dispatchEvent(new CustomEvent('openMemberModal'));
    }
  };

  return <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container py-8">
        <div className="flex justify-between items-center mb-8">
          <SectionTitle title="Gerenciar" subtitle="Painel de administração do sistema" />
          <Button onClick={handleCreateClick} className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-5">
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar
          </Button>
        </div>
        
        <Tabs defaultValue="games" value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted rounded-full p-1 mt-5">
            <TabsTrigger value="games" className="rounded-full">Jogos</TabsTrigger>
            <TabsTrigger value="accounts" className="rounded-full">Contas</TabsTrigger>
            <TabsTrigger value="members" className="rounded-full">Membros</TabsTrigger>
          </TabsList>
          
          <TabsContent value="games" className="space-y-4">
            <AdminGames />
          </TabsContent>
          
          <TabsContent value="accounts" className="space-y-4">
            <AdminAccounts />
          </TabsContent>
          
          <TabsContent value="members" className="space-y-4">
            <AdminMembers />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>;
};
export default AdminLayout;