import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaKey, FaSignOutAlt } from 'react-icons/fa';

const FacultyNavbar = ({ toggleSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Effect to close the menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuRef]);

  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between z-30 relative">
      <button onClick={toggleSidebar} className="text-slate-600 hover:text-blue-600">
        <FaBars size={20} />
      </button>
      
      <div ref={menuRef} className="relative">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-4 cursor-pointer">
          <span className="font-semibold text-slate-700 hidden sm:block">Dr. Meena Sharma</span>
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Faculty" className="w-10 h-10 rounded-full object-cover ring-2 ring-offset-2 ring-blue-300"/>
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50"
            >
              <ul>
                <li>
                  <button className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                    <FaKey /> Change Password
                  </button>
                </li>
                <li>
                  <button className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <FaSignOutAlt /> Logout
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default FacultyNavbar;

