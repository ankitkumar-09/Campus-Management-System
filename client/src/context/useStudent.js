import { useContext } from 'react';
import { StudentContext } from './StudentContext';

export const useStudent = () => {
  const ctx = useContext(StudentContext);
  if (ctx === undefined) {
    throw new Error('useAdmin must be used within an StudentProvider');
  }
  return ctx;
};

export default useStudent;
