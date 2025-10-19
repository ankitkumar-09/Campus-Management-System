import React, { createContext,useState } from 'react';
const AdminContext = createContext(null);
export { AdminContext };

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const value = {
    admin,
    setAdmin,
  };

  return( 
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
