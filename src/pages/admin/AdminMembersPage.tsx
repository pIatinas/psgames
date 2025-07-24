import React from 'react';
import AdminMembers from '@/components/admin/AdminMembers';
const AdminMembersPage: React.FC = () => {
  return <div>
      <h2 className="text-2xl font-bold mb-6 text-white">Membros</h2>
      <AdminMembers />
    </div>;
};
export default AdminMembersPage;