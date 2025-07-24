import React from 'react';
import AdminAccounts from '@/components/admin/AdminAccounts';
const AdminAccountsPage: React.FC = () => {
  return <div>
      <h2 className="text-2xl font-bold mb-6 text-white">Contas</h2>
      <AdminAccounts />
    </div>;
};
export default AdminAccountsPage;