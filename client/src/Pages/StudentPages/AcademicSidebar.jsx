import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AcademicSidebar = () => {
  const links = [
    { name: 'Attendance', path: '/student/academic/attendance' },
    { name: 'TimeTable', path: '/student/academic/timetable' },
    { name: 'Assignment', path: '/student/academic/assignment' },
    { name: 'Current Subject', path: '/student/academic/subjects' },
  ];

  const activeLinkStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    borderLeft: '4px solid white',
    paddingLeft: 'calc(1rem - 4px)', // Adjust padding to account for border
  };

  return (
    <div className="w-64 bg-blue-900 text-slate-200 h-full shadow-lg flex flex-col">
      {/* --- BACK TO DASHBOARD BUTTON --- */}
      <Link
        to="/student/dashboard"
        className="flex items-center gap-3 p-4 bg-blue-950 text-white font-semibold hover:bg-blue-800 transition-colors"
      >
        <FaArrowLeft />
        <span>Back to Dashboard</span>
      </Link>

      <div className="p-4 border-b border-t border-blue-800">
        <h2 className="text-lg font-bold text-white">Academic Menu</h2>
      </div>
      <nav>
        <ul>
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                className="block px-4 py-3 hover:bg-blue-800 hover:text-white transition-colors duration-200"
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AcademicSidebar;