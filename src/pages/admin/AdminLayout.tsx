import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminGames from '@/components/admin/AdminGames';
import AdminAccounts from '@/components/admin/AdminAccounts';
import AdminMembers from '@/components/admin/AdminMembers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
const AdminLayout: React.FC = () => {
  return <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container py-8">
        <div className="flex justify-between items-center mb-8">
          <SectionTitle title="Gerenciar" subtitle="Painel de administração do sistema" />
        </div>
        
        <Tabs defaultValue="games" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted rounded-full p-1 mt-5">
            <TabsTrigger value="games" className="rounded-full">Jogos</TabsTrigger>
            <TabsTrigger value="accounts" className="rounded-full">Contas</TabsTrigger>
            <TabsTrigger value="members" className="rounded-full">Membros</TabsTrigger>
          </TabsList>
          
          <TabsContent value="games" className="space-y-4">
            <AdminGames onOpenModal={() => {}} />
          </TabsContent>
          
          <TabsContent value="accounts" className="space-y-4">
            <AdminAccounts onOpenModal={() => {}} />
          </TabsContent>
          
          <TabsContent value="members" className="space-y-4">
            <AdminMembers onOpenModal={() => {}} />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>;
};
export default AdminLayout;