import React, { useState, useEffect, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaRegNewspaper,
  FaBullhorn,
  FaCalendarAlt,
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import NavbarAdmin from "./NavbarAdmin";
import axios from "axios";
import { motion } from "framer-motion";

// Helper for a nicely formatted date
const getCurrentDate = () => {
  return new Date().toLocaleDateString("en-US", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// A redesigned StatCard component for a more modern look
const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    className={`relative p-5 rounded-xl overflow-hidden text-white shadow-lg transition-transform transform hover:scale-105 ${color}`}
  >
    <div className="relative z-10">
      <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80">{title}</h3>
      <p className="text-4xl font-bold mt-1">{value}</p>
    </div>
    <div className="absolute -right-4 -bottom-4 text-6xl opacity-20 z-0">
      {icon}
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const { admin } = useContext(AdminContext);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/public/get-announcements`);
      setAnnouncements(response.data.announcements);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Your stats data, now with modern gradient colors
  const stats = [
    { title: "Total Students", value: "1200", icon: <FaUserGraduate />, color: "bg-gradient-to-br from-blue-400 to-blue-600" },
    { title: "Total Faculty", value: "80", icon: <FaChalkboardTeacher />, color: "bg-gradient-to-br from-green-400 to-green-600" },
    { title: "Courses", value: "45", icon: <FaBookOpen />, color: "bg-gradient-to-br from-yellow-400 to-yellow-600" },
    { title: "Notices", value: "10", icon: <FaRegNewspaper />, color: "bg-gradient-to-br from-purple-400 to-purple-600" },
    { title: "Events", value: "6", icon: <FaBullhorn />, color: "bg-gradient-to-br from-pink-400 to-pink-600" },
  ];

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 mt-12">
      <NavbarAdmin toggleSidebar={() => setIsOpen(!isOpen)} />

      <div className="flex flex-1">
        <Sidebar isOpen={isOpen} />

        <main className={`transition-all duration-300 flex-1 p-6 overflow-y-auto ${isOpen ? "ml-[220px]" : "ml-0"}`}>
          
          {/* ===== Welcome Header ===== */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-bold text-slate-800">
              Welcome back, {admin?.name || 'Admin'}! 👋
            </h2>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <FaCalendarAlt className="text-slate-400" />
              {getCurrentDate()}
            </p>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ===== Left Column: Stats Section ===== */}
            <div className="lg:col-span-2">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              >
                {stats.map((stat, i) => (
                  <StatCard key={i} {...stat} />
                ))}
              </motion.div>

              {/* You can add more components here like charts or recent activity */}
              
            </div>

            {/* ===== Right Column: Recent Announcements ===== */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 h-full"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-semibold text-slate-700 flex items-center gap-3">
                    <FaBullhorn className="text-pink-500" /> Recent Announcements
                  </h3>
                </div>

                <div className="space-y-4">
                  {announcements.length === 0 ? (
                    <div className="text-center py-8">
                        <FaRegNewspaper className="mx-auto text-4xl text-slate-300 mb-2"/>
                        <p className="text-slate-500 italic">No announcements to show.</p>
                    </div>
                  ) : (
                    announcements.slice(0, 5).map((item) => ( // Show latest 5
                      <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex-shrink-0 h-10 w-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
                          <FaBullhorn />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800 text-sm">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">
                             {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;