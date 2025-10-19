import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './Pages/AdminPages/AdminLogin'
import AdminProtectWrapper from './AdminProtectWrapper'
import Home from './Pages/OtherPages/Home'
import AdminDashboard from './Pages/AdminPages/AdminDashboard'
import Departments from './Pages/AdminPages/Departments'
import Admissions from './Pages/AdminPages/Admissions'
import Announcements from './Pages/AdminPages/Announcements'
import Courses from './Pages/AdminPages/Courses'
import Faculty from './Pages/AdminPages/Faculty'
import Students from './Pages/AdminPages/Students'
import ExamTimetable from './Pages/AdminPages/ExamTimetable'
import Result from './Pages/AdminPages/Result'
import Library from './Pages/AdminPages/Library'
import ChangePassword from './component/ChangePassword'
import AdminProfile from './Pages/AdminPages/AdminProfile'

import AdminLayout from './Pages/AdminPages/Layout';
import StudentLayout from './Pages/StudentPages/StudentLayout';
import AcademicLayout from './Pages/StudentPages/AcademicLayout';
import ExamLayout from './Pages/StudentPages/ExamLayout';
import FacultyLayout from './Pages/FacultyPages/FacultyLayout.jsx';

import StudentDashboard from './Pages/StudentPages/StudentDashboard';
import Circulars from './Pages/StudentPages/circulars';

// Academic Pages
import Attendance from './Pages/StudentPages/Attendance';
import TimeTable from './Pages/StudentPages/TimeTable';
import Assignment from './Pages/StudentPages/Assignment';
import Subjects from './Pages/StudentPages/Subjects';

// Exam Pages
import StudentResult from './Pages/StudentPages/Result';
import AdmitCard from './Pages/StudentPages/AdmitCard';
import BackExam from './Pages/StudentPages/BackExam';


import FacultyDashboard from './Pages/FacultyPages/FacultyDashboard.jsx';
import Schedule from './Pages/FacultyPages/Schedule.jsx';
import TakeAttendance from './Pages/FacultyPages/TakeAttendance.jsx';
import FacultyCirculars from './Pages/FacultyPages/FacultyCirculars.jsx';
import StudentProtectWrapper from './StudentProtectWrapper.jsx'

// --- Placeholder pages for routes not yet created ---
const AcademicHomePage = () => <div className="p-4 text-slate-600">Please select an option from the Academic Menu.</div>;
const FeePage = () => <div className="p-6">Fee Payment Page Content</div>;
const FacultyLoginPage = () => <div className="p-6">Faculty Login Page</div>;
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/faculty/login" element={<FacultyLoginPage />} />

        <Route path='/admin/profile' element={<AdminProtectWrapper><AdminProfile/></AdminProtectWrapper>} />
        <Route path="/admin" element={<AdminProtectWrapper><AdminDashboard /></AdminProtectWrapper>} />
        <Route path="/admin/changepassword" element={<AdminProtectWrapper><ChangePassword /></AdminProtectWrapper>} />
        <Route path="/admin/admissions" element={<AdminProtectWrapper><Admissions /></AdminProtectWrapper>} />
        <Route path="/admin/announcements" element={<AdminProtectWrapper><Announcements /></AdminProtectWrapper>} />
        <Route path="/admin/departments" element={<AdminProtectWrapper><Departments /></AdminProtectWrapper>} />
        <Route path="/admin/courses" element={<AdminProtectWrapper><Courses /></AdminProtectWrapper>} />
        <Route path="/admin/faculty" element={<AdminProtectWrapper><Faculty /></AdminProtectWrapper>} />
        <Route path="/admin/students" element={<AdminProtectWrapper><Students /></AdminProtectWrapper>} />
        <Route path="/admin/exam-timetable" element={<AdminProtectWrapper><ExamTimetable /></AdminProtectWrapper>} />
        <Route path="/admin/result" element={<AdminProtectWrapper><Result /></AdminProtectWrapper>} />
        <Route path="/admin/library" element={<AdminProtectWrapper><Library /></AdminProtectWrapper>} />
        
        <Route path="/student/dashboard" element={<StudentDashboard />} />

        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="circulars" element={<Circulars />} />
          <Route path="fee" element={<FeePage />} />
        </Route>
        
        {/* == ACADEMIC SECTION ROUTES (with Layout) == */}
        <Route path="/student/academic" element={<AcademicLayout />}>
            <Route index element={<AcademicHomePage />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="timetable" element={<TimeTable />} />
            <Route path="assignment" element={<Assignment />} />
            <Route path="subjects" element={<Subjects />} />
        </Route>

        {/* == EXAM SECTION ROUTES (with Layout) == */}
        <Route path="/student/exams" element={<ExamLayout />}>
            <Route index element={<Navigate to="result" replace />} />
            <Route path="result" element={<StudentResult />} />
            <Route path="admit-card" element={<AdmitCard />} />
            <Route path="back-exam" element={<BackExam />} />
        </Route>

        <Route path="/faculty" element={<FacultyLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<FacultyDashboard />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="attendance" element={<TakeAttendance />} />
            <Route path="circular" element={<FacultyCirculars />} />
        </Route>

        {/* 404 Not Found Route */}
        <Route path="*" element={<div>404 Not Found</div>} />

      </Routes>
    </Router>
  )
}

export default App



// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // --- PROTECTION WRAPPERS ---
// import AdminProtectWrapper from './AdminProtectWrapper';

// // --- IMPORT LAYOUTS ---
// import AdminLayout from './Pages/AdminPages/Layout';
// import StudentLayout from './Pages/StudentPages/StudentLayout';
// import AcademicLayout from './Pages/StudentPages/AcademicLayout';
// import ExamLayout from './Pages/StudentPages/ExamLayout';

// // --- IMPORT ADMIN & OTHER PAGES ---
// import Home from './Pages/OtherPages/Home';
// import AdminLogin from './Pages/AdminPages/AdminLogin';
// import AdminDashboard from './Pages/AdminPages/AdminDashboard';
// import AdminProfile from './Pages/AdminPages/AdminProfile';
// import ChangePassword from './component/ChangePassword';
// import Announcements from './Pages/AdminPages/Announcements';
// import Departments from './Pages/AdminPages/Departments';
// import Courses from './Pages/AdminPages/Courses';
// import Faculty from './Pages/AdminPages/Faculty';
// import Students from './Pages/AdminPages/Students';
// import ExamTimetable from './Pages/AdminPages/ExamTimetable';
// import Result from './Pages/AdminPages/Result';
// import Library from './Pages/AdminPages/Library';
// import Admissions from './Pages/AdminPages/Admissions';

// // --- IMPORT STUDENT PAGES ---
// import StudentDashboard from './Pages/StudentPages/StudentDashboard';
// import Circulars from './Pages/StudentPages/circulars';

// // Academic Pages
// import Attendance from './Pages/StudentPages/Attendance';
// import TimeTable from './Pages/StudentPages/TimeTable';
// import Assignment from './Pages/StudentPages/Assignment';
// import Subjects from './Pages/StudentPages/Subjects';

// // Exam Pages
// import StudentResult from './Pages/StudentPages/Result';
// import AdmitCard from './Pages/StudentPages/AdmitCard';
// import BackExam from './Pages/StudentPages/BackExam';

// // --- Placeholder pages for routes not yet created ---
// const AcademicHomePage = () => <div className="p-4 text-slate-600">Please select an option from the Academic Menu.</div>;
// const FeePage = () => <div className="p-6">Fee Payment Page Content</div>;


// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         {/* Standalone pages without a layout */}
//         <Route path="/" element={<Home />} />
//         <Route path="/admin/login" element={<AdminLogin />} />

//         {/* == ADMIN ROUTES (with Protection & Layout) == */}
//         {/* All nested routes are protected by AdminProtectWrapper */}
//         <Route path="/admin" element={<AdminProtectWrapper><AdminLayout /></AdminProtectWrapper>}>
//           <Route index element={<Navigate to="/admin/dashboard" replace />} />
//           <Route path="dashboard" element={<AdminDashboard />} />
//           <Route path="profile" element={<AdminProfile />} />
//           <Route path="changepassword" element={<ChangePassword />} />
//           <Route path="admissions" element={<Admissions />} />
//           <Route path="announcements" element={<Announcements />} />
//           <Route path="departments" element={<Departments />} />
//           <Route path="courses" element={<Courses />} />
//           <Route path="faculty" element={<Faculty />} />
//           <Route path="students" element={<Students />} />
//           <Route path="exam-timetable" element={<ExamTimetable />} />
//           <Route path="result" element={<Result />} />
//           <Route path="library" element={<Library />} />
//         </Route>

//         {/* == MAIN STUDENT ROUTES (with Layout) == */}
//         {/* Note: You would likely add a <StudentProtectWrapper> here in a real app */}
//         <Route path="/student" element={<StudentLayout />}>
//           <Route index element={<Navigate to="dashboard" replace />} />
//           <Route path="dashboard" element={<StudentDashboard />} />
//           <Route path="circulars" element={<Circulars />} />
//           <Route path="fee" element={<FeePage />} />
//         </Route>
        
//         {/* == ACADEMIC SECTION ROUTES (with Layout) == */}
//         <Route path="/student/academic" element={<AcademicLayout />}>
//             <Route index element={<AcademicHomePage />} />
//             <Route path="attendance" element={<Attendance />} />
//             <Route path="timetable" element={<TimeTable />} />
//             <Route path="assignment" element={<Assignment />} />
//             <Route path="subjects" element={<Subjects />} />
//         </Route>

//         {/* == EXAM SECTION ROUTES (with Layout) == */}
//         <Route path="/student/exams" element={<ExamLayout />}>
//             <Route index element={<Navigate to="result" replace />} />
//             <Route path="result" element={<StudentResult />} />
//             <Route path="admit-card" element={<AdmitCard />} />
//             <Route path="back-exam" element={<BackExam />} />
//         </Route>

//       </Routes>
//     </Router>
//   );
// };

// export default App;