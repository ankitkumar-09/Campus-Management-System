import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUserCheck,
  FaBullhorn,
} from 'react-icons/fa';

const FacultySidebar = ({ isOpen }) => {
  const links = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/faculty/dashboard' },
    { name: 'Schedule', icon: <FaCalendarAlt />, path: '/faculty/schedule' },
    { name: 'Take Attendance', icon: <FaUserCheck />, path: '/faculty/attendance' },
    { name: 'Circular', icon: <FaBullhorn />, path: '/faculty/circular' },
  ];

  const sidebarVariants = {
    open: { width: '16rem' }, // w-64
    closed: { width: '5rem' }, // w-20
  };

  const linkTextVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -10 },
  };

  const activeLinkStyle = {
    backgroundColor: 'rgba(59, 130, 246, 0.2)', // A light blue background
    color: 'white',
    borderLeft: '4px solid #3B82F6', // Blue left border
  };

  return (
    <motion.div
      variants={sidebarVariants}
      animate={isOpen ? 'open' : 'closed'}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 h-full bg-slate-800 text-white z-40"
    >
      <div className="flex items-center justify-center p-4 border-b border-slate-700 h-16">
        <h1 className="text-xl font-bold whitespace-nowrap overflow-hidden">
          <motion.span variants={linkTextVariants}>Faculty Portal</motion.span>
        </h1>
      </div>
      <nav className="mt-4">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="flex items-center gap-4 px-6 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <span className="text-xl">{link.icon}</span>
            <motion.span
              variants={linkTextVariants}
              className="whitespace-nowrap overflow-hidden"
            >
              {link.name}
            </motion.span>
          </NavLink>
        ))}
      </nav>
    </motion.div>
  );
};

export default FacultySidebar;

