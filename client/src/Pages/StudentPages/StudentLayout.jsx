import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import StudentSidebar from './StudentSidebar';
import StudentNavbar from './StudentNavbar';

const StudentLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="relative min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <StudentSidebar isOpen={isSidebarOpen} />

      {/* Main content area */}
      <motion.div
        animate={{
          marginLeft: isSidebarOpen ? '256px' : '0px', // 256px = w-64
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex flex-col flex-1 min-h-screen"
      >
        {/* Navbar */}
        <div className="sticky top-0 z-40">
          <StudentNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto mt-4 p-4">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
};

export default StudentLayout;