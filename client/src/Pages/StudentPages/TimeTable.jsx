// src/Pages/StudentPages/TimeTable.jsx

import React from 'react';

const TimeTable = () => {
  const schedule = {
    Monday: ["Data Structures", "DBMS", "Break", "Operating Systems", "Computer Networks"],
    Tuesday: ["DBMS", "Operating Systems", "Break", "Data Structures", "Software Engg."],
    Wednesday: ["Operating Systems", "Computer Networks", "Break", "DBMS", "Data Structures"],
    Thursday: ["Computer Networks", "Software Engg.", "Break", "Data Structures", "DBMS"],
    Friday: ["Software Engg.", "Data Structures", "Break", "Computer Networks", "Operating Systems"],
  };
  const timeSlots = ["9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 1:00", "1:00 - 2:00"];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Weekly TimeTable</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-3 border">Time</th>
              {Object.keys(schedule).map(day => <th key={day} className="p-3 border">{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, index) => (
              <tr key={time} className="hover:bg-slate-50">
                <td className="p-3 border font-semibold">{time}</td>
                {Object.keys(schedule).map(day => (
                  <td key={day} className={`p-3 border ${schedule[day][index] === 'Break' ? 'bg-slate-100 font-medium' : ''}`}>
                    {schedule[day][index]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeTable;