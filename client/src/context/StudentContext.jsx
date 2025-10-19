import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const StudentContext = createContext(null);
export { StudentContext };

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchStudent = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setStudent(null);
        setLoading(false);
        return;
      }
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/student/profile-by-token`, {
        params: { token },
      });
      console.log(response)
      if (response.status === 200) {
        setStudent(response.data);
      } else {
        setStudent(null);
      }
    } catch (err) {
      console.error('Failed to fetch student profile:', err?.message || err);
      // clear invalid token/role
      // localStorage.removeItem('token');
      // localStorage.removeItem('role');
      setStudent(null);
      setError(err?.message || 'Failed to fetch student');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  const value = {
    student,
    setStudent,
    loading,
    error,
    refresh: fetchStudent,
  };

  return( 
    <StudentContext.Provider value={value}>
        {children}
    </StudentContext.Provider>
  );
};

export default StudentProvider;
