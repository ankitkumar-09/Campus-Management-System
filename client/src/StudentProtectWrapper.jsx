import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from './context/useStudent';

const StudentProtectWrapper = ({ children }) => {
  const navigate = useNavigate();

  const { student, loading, refresh } = useStudent();

  useEffect(() => {
    const studentToken = localStorage.getItem('token');
    if (!student && studentToken) {
      console.log("refesshingg");
      refresh();
    }
    if (!loading && !student) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student, loading, navigate]);

  if (loading) return null; // or a spinner

  return <>{children}</>;
};

export default StudentProtectWrapper;
