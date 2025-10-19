// src/Pages/StudentPages/AcademicLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentNavbar from './StudentNavbar';
import AcademicSidebar from './AcademicSidebar';

const AcademicLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50">
      <AcademicSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Pass null to toggleSidebar to hide the hamburger icon */}
        <StudentNavbar toggleSidebar={null} isSidebarOpen={false} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AcademicLayout;