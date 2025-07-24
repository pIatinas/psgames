
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminLayout = () => {
  const location = useLocation();

  const adminPages = [
    { name: 'Jogos', path: '/admin/games' },
    { name: 'Contas', path: '/admin/accounts' },
    { name: 'Membros', path: '/admin/members' }
  ];

  const getPageTitle = () => {
    const currentPage = adminPages.find(page => page.path === location.pathname);
    return currentPage ? currentPage.name : 'Gerenciar';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-pink-500">Gerenciar</h1>
          <Button className="rounded-full">
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar
          </Button>
        </div>

        <div className="flex gap-4 border-b mb-6">
          {adminPages.map(page => (
            <Button
              key={page.path}
              variant={location.pathname === page.path ? "default" : "ghost"}
              asChild
              className={cn(
                "rounded-full border-b-2 border-transparent pb-3",
                location.pathname === page.path && "border-primary bg-primary text-primary-foreground",
                location.pathname !== page.path && "hover:bg-white hover:text-gray-900"
              )}
            >
              <Link to={page.path}>{page.name}</Link>
            </Button>
          ))}
        </div>
        
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminLayout;
