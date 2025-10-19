// src/Pages/StudentPages/Subjects.jsx

import React from 'react';
import { FaUserTie, FaBarcode } from 'react-icons/fa';

const Subjects = () => {
  const subjectList = [
    { name: 'Data Structures & Algorithms', code: 'CSE201', faculty: 'Dr. Anjali Verma' },
    { name: 'Database Management Systems', code: 'CSE202', faculty: 'Prof. Sameer Joshi' },
    { name: 'Operating Systems', code: 'CSE203', faculty: 'Dr. Ritu Kapoor' },
    { name: 'Computer Networks', code: 'CSE204', faculty: 'Prof. Alok Nath' },
    { name: 'Software Engineering', code: 'CSE205', faculty: 'Dr. Sunita Reddy' },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Current Subjects</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {subjectList.map(item => (
          <div key={item.code} className="p-4 border rounded-lg bg-slate-50">
            <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
            <div className="mt-2 space-y-1 text-sm text-slate-600">
                <p className="flex items-center gap-2"><FaBarcode /> {item.code}</p>
                <p className="flex items-center gap-2"><FaUserTie /> {item.faculty}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subjects;