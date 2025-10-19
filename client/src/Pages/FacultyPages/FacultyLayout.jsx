import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import FacultySidebar from './FacultySidebar';
import FacultyNavbar from './FacultyNavbar';

const FacultyLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative min-h-screen bg-slate-100">
      <FacultySidebar isOpen={isSidebarOpen} />
      <motion.div
        animate={{ 
          // Push content to the right based on whether the sidebar is open or closed
          marginLeft: isSidebarOpen ? '256px' : '80px' 
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex flex-col h-screen"
      >
        <FacultyNavbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Child routes from App.jsx will be rendered here */}
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
};

export default FacultyLayout;

