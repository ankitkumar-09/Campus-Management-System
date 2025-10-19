import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaClipboardList,
  FaBullhorn,
  FaRegCalendarAlt,
  FaRegNewspaper,
  FaUniversity,
} from "react-icons/fa";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { IoHome } from "react-icons/io5";
// admin context can be imported when needed in future
const menuItems = [
  { name: "Dashboard", path: "/admin", icon: <IoHome /> },
  { name: "Admissions", path: "/admin/admissions", icon: <FaUniversity /> },
  { name: "Announcements", path: "/admin/announcements", icon: <FaBullhorn /> },
  { name: "Departments", path: "/admin/departments", icon: <AccountTreeIcon/> },
  { name: "Courses", path: "/admin/courses", icon: <FaBookOpen /> },
  { name: "Faculty", path: "/admin/faculty", icon: <FaChalkboardTeacher /> },
  { name: "Students", path: "/admin/students", icon: <FaUserGraduate /> },
  // { name: "Exam Timetable", path: "/admin/exam-timetable", icon: <FaRegCalendarAlt /> },
  // { name: "Result", path: "/admin/result", icon: <FaClipboardList /> },
  // { name: "Library", path: "/admin/library", icon: <FaBookOpen /> },
];

const Sidebar = ({ isOpen }) => {
  // If you want to redirect when not logged in, handle it elsewhere (e.g. AdminProtectWrapper)

  return (
    <motion.aside
      initial={{ width: 0 }}
      animate={{ width: isOpen ? 220 : 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 text-white fixed top-[60px] left-0 h-[calc(100vh-60px)] shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
    >
      <ul className="mt-5 space-y-2 px-3">
        {menuItems.map((item, index) => (
          <li key={index} className="p-2 hover:bg-gray-700 rounded-lg">
            <Link to={item.path} className="flex items-center space-x-3">
              <span className="text-lg">{item.icon}</span>
              <span className={`${!isOpen && "hidden"} md:inline`}>
                {item.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </motion.aside>
  );
};

export default Sidebar;
