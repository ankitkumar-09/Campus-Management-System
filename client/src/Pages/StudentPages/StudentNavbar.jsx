import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// --- FIX: Added FaTimes to the import list ---
import { FaBars, FaTimes, FaKey, FaSignOutAlt } from 'react-icons/fa';
import { StudentContext } from '../../context/StudentContext';
const StudentNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const {student}=useContext(StudentContext);
  console.log(student);

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
      {/* Left side: Menu toggle */}
      {/* Only show the button if the toggle function is provided */}
      {toggleSidebar && (
        <button onClick={toggleSidebar} className="text-slate-600 hover:text-blue-600">
          {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      )}

      {/* This div helps to center the profile when the toggle is hidden */}
      {!toggleSidebar && <div />}

      {/* Right side: Profile with Dropdown */}
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-4 cursor-pointer"
        >
          <span className="font-semibold text-slate-700 hidden sm:block">Shashank Bisht</span>
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold ring-2 ring-offset-2 ring-blue-300">
            SB
          </div>
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50"
            >
              <ul>
                <li>
                  <button
                    onClick={() => alert('Change Password Clicked!')}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <FaKey className="text-slate-500" />
                    Change Password
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => alert('Logout Clicked!')}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <FaSignOutAlt className="text-red-500" />
                    Logout
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

export default StudentNavbar;