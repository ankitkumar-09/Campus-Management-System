// src/Pages/StudentPages/Attendance.jsx

import React from 'react';
import { FaBook, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Attendance = () => {
  const attendanceData = [
    { subject: 'Data Structures & Algorithms', code: 'CSE201', total: 60, attended: 52 },
    { subject: 'Database Management Systems', code: 'CSE202', total: 55, attended: 48 },
    { subject: 'Operating Systems', code: 'CSE203', total: 58, attended: 41 },
    { subject: 'Computer Networks', code: 'CSE204', total: 62, attended: 59 },
    { subject: 'Software Engineering', code: 'CSE205', total: 50, attended: 45 },
  ];

  const overallPercentage =
    (attendanceData.reduce((acc, sub) => acc + sub.attended, 0) /
      attendanceData.reduce((acc, sub) => acc + sub.total, 0)) *
    100;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Attendance Summary</h2>
      
      {/* Overall Attendance */}
      <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-slate-700">Overall Attendance</h3>
        <p className="text-3xl font-bold text-blue-600">{overallPercentage.toFixed(2)}%</p>
      </div>

      {/* Subject-wise Attendance */}
      <div className="space-y-4">
        {attendanceData.map((item) => {
          const percentage = (item.attended / item.total) * 100;
          const isBelowThreshold = percentage < 75;
          
          return (
            <div key={item.code} className="p-4 border rounded-lg hover:bg-slate-50 transition">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-slate-700">{item.subject}</h4>
                <span className={`font-bold text-lg ${isBelowThreshold ? 'text-red-500' : 'text-green-500'}`}>
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${isBelowThreshold ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Attended: {item.attended} / {item.total} Lectures
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Attendance;