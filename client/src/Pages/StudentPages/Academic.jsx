import React from 'react';
import StudentLayout from './StudentLayout'; // Your main student layout
import AcademicLayout from './AcademicLayout'; // The new academic layout
import { Outlet } from 'react-router-dom'; // Import Outlet for nested routes

const Academic = () => {
  return (
    <StudentLayout>
      <AcademicLayout>
        {/* This is where your nested routes (Attendance, TimeTable, etc.) will render.
          For now, it shows a default message. To make the links work, you would
          replace the message below with <Outlet /> and set up nested routes in your App.js.
        */}
        <div className="p-6 bg-slate-100 rounded-lg h-full">
          <h3 className="text-lg text-slate-600">
            Please Select a Menu From The Menu Bar.
          </h3>
        </div>
      </AcademicLayout>
    </StudentLayout>
  );
};

export default Academic;