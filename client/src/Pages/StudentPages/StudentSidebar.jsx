import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaTachometerAlt,
  FaBook,
  FaMoneyBillWave,
  FaBullhorn,
  FaFileSignature,
} from 'react-icons/fa';

const StudentSidebar = ({ isOpen }) => {
  const links = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/student/dashboard' },
    { name: 'Academic', icon: <FaBook />, path: '/student/academic' },
    { name: 'Fee Payment', icon: <FaMoneyBillWave />, path: '/student/fee' },
    { name: 'Circulars', icon: <FaBullhorn />, path: '/student/circulars' },
    { name: 'Exams', icon: <FaFileSignature />, path: '/student/exams' },
  ];

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      className="fixed top-0 left-0 h-full w-64 bg-slate-800 text-white z-40"
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold">Student Portal</h1>
      </div>
      <nav className="mt-4">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="flex items-center gap-4 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>
    </motion.div>
  );
};

export default StudentSidebar;