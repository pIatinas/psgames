
import React from 'react';
import AdminGames from '@/components/admin/AdminGames';

const AdminGamesPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">Gerenciar Jogos</h2>
      <AdminGames />
    </div>
  );
};

export default AdminGamesPage;
