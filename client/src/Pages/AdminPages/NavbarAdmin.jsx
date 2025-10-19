import React from "react";
import { FaBars } from "react-icons/fa";
import ProfileMenu from "./ProfileMenu";
import logo from "../../assets/Logo.png";

const NavbarAdmin = ({ toggleSidebar }) => {
  return (
    <nav className="flex items-center justify-between bg-gray-900 text-white px-5 py-3 shadow-md fixed top-0 left-0 w-full z-20">
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-800 focus:outline-none"
        >
          <FaBars size={22} />
        </button>
        <img
          src={logo}
          alt="Logo"
          className="w-10 h-10 rounded-full"
        />
        <h1 className="text-xl font-semibold">GEHU Admin</h1>
      </div>
      <ProfileMenu />
    </nav>
  );
};

export default NavbarAdmin;
