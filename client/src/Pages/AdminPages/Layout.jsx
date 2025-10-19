import React, { useState } from "react";
import NavbarAdmin from "./NavbarAdmin";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="h-screen bg-gray-100">
      <NavbarAdmin toggleSidebar={() => setIsOpen(!isOpen)} />
      <div className="flex">
        <div className="fixed top-[60px] left-0 bottom-0">
          <Sidebar isOpen={isOpen} />
        </div>
        <main
          className={`${
            isOpen ? "ml-[220px]" : "ml-0"
          } pt-[80px] p-6 flex-1 overflow-y-auto transition-all duration-300`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;