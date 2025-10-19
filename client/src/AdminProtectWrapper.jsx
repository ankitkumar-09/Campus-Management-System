import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AdminContext } from './context/AdminContext';

const AdminProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { admin, setAdmin } = useContext(AdminContext);

  useEffect(() => {
    if (admin) {
      return;
    }
    const adminToken = localStorage.getItem('token');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    const validateAdmin = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/validate-token`,{ token: adminToken });

        if (response.status === 200) {
          setAdmin(response.data.user);
        } else {
          localStorage.removeItem('token');
          navigate('/admin/login');
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        localStorage.removeItem('token');
        navigate('/admin/login');
      }
    };

    validateAdmin();
  }, []);
  return admin ? <>{children}</> : null; 
};

export default AdminProtectWrapper;