import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
const AdminLayout = () => {
  const location = useLocation();
  const adminPages = [{
    name: 'Jogos',
    path: '/admin/games'
  }, {
    name: 'Contas',
    path: '/admin/accounts'
  }, {
    name: 'Membros',
    path: '/admin/members'
  }];
  return <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-pink-500">Gerenciar</h1>
          <div className="flex gap-4 border-b">
            {adminPages.map(page => <Button key={page.path} variant={location.pathname === page.path ? "default" : "ghost"} asChild className={cn("rounded-b-none border-b-2 border-transparent pb-3", location.pathname === page.path && "border-primary bg-primary text-primary-foreground", location.pathname !== page.path && "hover:text-white")}>
                <Link to={page.path}>{page.name}</Link>
              </Button>)}
          </div>
        </div>
        
        <Outlet />
      </main>
      
      <Footer />
    </div>;
};
export default AdminLayout;