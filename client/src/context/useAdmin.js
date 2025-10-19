import { useContext } from 'react';
import { AdminContext } from './AdminContext';

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (ctx === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return ctx;
};

export default useAdmin;
