import React, { useContext, useState } from "react";
import { FaLock, FaSignOutAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import noProfile from "../../assets/noProfile.png";

const ProfileMenu = () => {
  const { admin } = useContext(AdminContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const changepassword = () => navigate("/admin/changepassword");

  const logoutAdmin = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    const token = localStorage.getItem("token");
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/logout`, { token });
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/admin/login");
  };

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Profile Display */}
      <div className="flex items-center gap-3 cursor-pointer group">
        <img
          src={admin?.admin?.profileImage || noProfile}
          alt="Admin Profile"
          className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover transition-transform group-hover:scale-105"
        />
        <span className="font-semibold text-white tracking-wide text-[15px]">
          {admin?.admin?.name || "Admin"}
        </span>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 shadow-2xl rounded-xl overflow-hidden z-20"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
              <img
                src={admin?.admin?.profileImage || noProfile}
                alt="Profile"
                className="w-9 h-9 rounded-full border border-white object-cover"
              />
              <div onClick={()=>{
                navigate('/admin/profile');
              }}>
                <p className="font-semibold text-sm">
                  {admin?.admin?.name || "Administrator"}
                </p>
                <p className="text-xs opacity-90">
                  {admin?.admin?.email || "admin@example.com"}
                </p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={changepassword}
                className="flex items-center gap-2 px-4 py-3 w-full text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium"
              >
                <FaLock className="text-[15px]" />
                <span>Change Password</span>
              </button>

              <button
                onClick={logoutAdmin}
                className="flex items-center gap-2 px-4 py-3 w-full text-gray-700 hover:bg-red-50 hover:text-red-600 border-t border-gray-100 transition font-medium"
              >
                <FaSignOutAlt className="text-[15px]" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMenu;
