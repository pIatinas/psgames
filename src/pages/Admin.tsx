
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminGames from '@/components/admin/AdminGames';
import AdminAccounts from '@/components/admin/AdminAccounts';
import AdminMembers from '@/components/admin/AdminMembers';

const Admin: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6 text-pink-500">Área Administrativa</h1>
        
        <Tabs defaultValue="games" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="games">Jogos</TabsTrigger>
            <TabsTrigger value="accounts">Contas</TabsTrigger>
            <TabsTrigger value="members">Membros</TabsTrigger>
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
    </div>
  );
};

export default Admin;
