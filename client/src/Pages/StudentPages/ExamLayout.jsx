import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentNavbar from './StudentNavbar'; // Assuming this is in the same folder
import ExamSidebar from './ExamSidebar';

const ExamLayout = () => {
  return (
    <div className="flex h-screen bg-slate-100">
      <ExamSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Pass null to toggleSidebar to hide the hamburger icon */}
        <StudentNavbar toggleSidebar={null} isSidebarOpen={false} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet /> {/* Child pages (Result, Admit Card) will render here */}
        </main>
      </div>
    </div>
  );
};

export default ExamLayout;
