import Sidebar from '../components/admin/Sidebar';
import React, { type PropsWithChildren } from 'react';

const AdminLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-200 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
