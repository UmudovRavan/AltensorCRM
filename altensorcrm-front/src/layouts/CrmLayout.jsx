import React from 'react';
import { Outlet } from 'react-router-dom';
import CrmSidebar from '../components/layout/CrmSidebar';

const CrmLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#121214] font-sans antialiased text-[#F4F4F5] selection:bg-fuchsia-500/30">
      {/* Fixed Sidebar */}
      <CrmSidebar />

      {/* Main Scrollable Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-[#121214] scroll-smooth">
        <main className="flex-1 p-4 lg:p-6 pb-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CrmLayout;
