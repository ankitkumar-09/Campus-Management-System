import React, { useState, useEffect } from 'react';

// --- Helper Data & Functions ---

// Expanded student data, simulating a database record.
const initialStudentsData = [
  { id: 1, studentId: 1, universityId: '2100101', name: 'Aarav Sharma', fatherName: 'Rakesh Sharma', status: 'present' },
  { id: 2, studentId: 2, universityId: '2100102', name: 'Vivaan Singh', fatherName: 'Manoj Singh', status: 'present' },
  { id: 3, studentId: 3, universityId: '2100103', name: 'Aditya Kumar', fatherName: 'Sanjay Kumar', status: 'absent' },
  { id: 4, studentId: 4, universityId: '2100104', name: 'Vihaan Gupta', fatherName: 'Anil Gupta', status: 'present' },
  { id: 5, studentId: 5, universityId: '2100105', name: 'Ishaan Patel', fatherName: 'Vipin Patel', status: 'present' },
  { id: 6, studentId: 6, universityId: '2100106', name: 'Reyansh Reddy', fatherName: 'Arun Reddy', status: 'present' },
  { id: 7, studentId: 7, universityId: '2100107', name: 'Arjun Mehra', fatherName: 'Deepak Mehra', status: 'present' },
  { id: 8, studentId: 8, universityId: '2100108', name: 'Sai Khanna', fatherName: 'Rajesh Khanna', status: 'absent' },
  { id: 9, studentId: 9, universityId: '2100109', name: 'Muhammad Khan', fatherName: 'Imran Khan', status: 'present' },
  { id: 10, studentId: 10, universityId: '2100110', name: 'Ananya Roy', fatherName: 'Amit Roy', status: 'present' },
  { id: 11, studentId: 11, universityId: '2100111', name: 'Diya Verma', fatherName: 'Prakash Verma', status: 'absent' },
  { id: 12, studentId: 12, universityId: '2100112', name: 'Saanvi Joshi', fatherName: 'Nitin Joshi', status: 'present' },
];

// Mock function to simulate fetching data from a backend.
const fetchStudentData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initialStudentsData);
    }, 1000); // 1-second delay to simulate network request
  });
};


// Get current date formatted
const getCurrentDate = () => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
};


// --- Main Application Component ---

export default function App() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch student data when the component mounts
  useEffect(() => {
    fetchStudentData().then(data => {
      setStudents(data);
      setIsLoading(false);
    });
  }, []);

  /**
   * Handles updating a student's attendance status.
   * @param {number} studentId - The ID of the student to update.
   * @param {'present' | 'absent'} newStatus - The new attendance status.
   */
  const handleStatusChange = (studentId, newStatus) => {
    setStudents(currentStudents =>
      currentStudents.map(student =>
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );
  };

  // Marks all students as present
  const handleMarkAllPresent = () => {
    setStudents(currentStudents =>
      currentStudents.map(student => ({ ...student, status: 'present' }))
    );
  };

  // Marks all students as absent (Mass Bunk)
  const handleMassBunk = () => {
    setStudents(currentStudents =>
      currentStudents.map(student => ({ ...student, status: 'absent' }))
    );
  };

  // Naya function: Roll numbers ke base par present mark karne ke liye
  const handlePresentByRollNo = (rollNoString) => {
    if (!rollNoString.trim()) {
      return; // Agar input khali hai to kuch na karein
    }

    // Input string ko process karke roll numbers ki list banayein
    const presentRollNos = rollNoString
      .split(',')
      .map(s => s.trim())
      .filter(s => s && !isNaN(s))
      .map(numStr => parseInt(numStr, 10)); // Format: 1, 2, 3...

    setStudents(currentStudents =>
      currentStudents.map(student => {
        // Agar student ka roll number list mein hai, to 'present', varna 'absent'
        if (presentRollNos.includes(student.studentId)) {
          return { ...student, status: 'present' };
        } else {
          return { ...student, status: 'absent' };
        }
      })
    );
  };
  
  // Simulates submitting the attendance data to a backend
  const handleSubmit = () => {
    console.log("Submitting Attendance Data:", students);
    // In a real app, you would show a success message in the UI instead of an alert.
    alert("Attendance submitted successfully! Check the console for the data.");
  };

  // --- Child Components ---

  const Header = () => (
    <div className="text-center p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
      <h1 className="text-3xl font-bold text-gray-800">Attendance Sheet</h1>
      <p className="text-md text-gray-500 mt-2">{getCurrentDate()}</p>
    </div>
  );

  const BulkActions = () => (
    <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-center items-center space-x-4">
        <button 
            onClick={handleMarkAllPresent}
            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-200"
        >
            All Present
        </button>
        <button 
            onClick={handleMassBunk}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200"
        >
            Mass Bunk
        </button>
    </div>
  );

  // Naya component: Roll number enter karne ke liye
  const RollNoEntry = ({ onApply }) => {
    const [rollNoInput, setRollNoInput] = useState('');

    const handleApplyClick = () => {
        onApply(rollNoInput);
        setRollNoInput(''); // Apply karne ke baad input khali kar dein
    };

    return (
        <div className="p-4 border-b border-gray-200">
            <p className="text-center text-gray-600 font-medium mb-2">Mark Present by Roll Number</p>
            <div className="flex justify-center gap-2">
                <input
                    type="text"
                    value={rollNoInput}
                    onChange={(e) => setRollNoInput(e.target.value)}
                    placeholder="Enter roll no's like 2, 4, 5, 8"
                    className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    onClick={handleApplyClick}
                    className="px-8 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-200"
                >
                    Apply
                </button>
            </div>
        </div>
    );
  };


  const StudentList = () => {
    if (isLoading) {
      return <div className="p-8 text-center text-gray-500">Loading student data...</div>;
    }
    return (
      <ul className="divide-y divide-gray-200 p-4 sm:p-6">
        {students.map((student) => (
          <StudentRow 
            key={student.id} 
            student={student} 
          />
        ))}
      </ul>
    );
  };

  const StudentRow = ({ student }) => (
    <li className="flex flex-col sm:flex-row items-center justify-between py-4 space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 text-lg">
          {student.studentId}
        </div>
        <div>
            <p className="font-medium text-lg text-gray-800">{student.name}</p>
            <p className="text-sm text-gray-500">Father: {student.fatherName}</p>
            <p className="text-xs text-gray-400">Student ID: {student.universityId}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <StatusButton studentId={student.id} currentStatus={student.status} status="present" color="green" />
        <StatusButton studentId={student.id} currentStatus={student.status} status="absent" color="red" />
      </div>
    </li>
  );

  const StatusButton = ({ studentId, currentStatus, status, color }) => {
    const isSelected = currentStatus === status;
    const baseClasses = "w-24 px-4 py-2 text-sm font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105";
    const selectedClasses = `bg-${color}-500 text-white shadow-md`;
    const unselectedClasses = `bg-white border-2 border-${color}-400 text-${color}-500 hover:bg-${color}-50`;
    
    return (
        <button
            onClick={() => handleStatusChange(studentId, status)}
            className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
    );
  };
  
  const AttendanceSummary = () => {
    const presentCount = students.filter(s => s.status === 'present').length;
    const absentCount = students.filter(s => s.status === 'absent').length;

    return (
        <div className="p-6 bg-gray-50 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                <div className="bg-green-100 text-green-800 p-3 rounded-lg">
                    <p className="font-bold text-2xl">{presentCount}</p>
                    <p className="text-sm">Present</p>
                </div>
                <div className="bg-red-100 text-red-800 p-3 rounded-lg">
                    <p className="font-bold text-2xl">{absentCount}</p>
                    <p className="text-sm">Absent</p>
                </div>
            </div>
        </div>
    );
  };
  
  const Footer = () => (
    <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-xl text-center">
        <button 
            onClick={handleSubmit}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200"
        >
            Submit Attendance
        </button>
    </div>
  );

  // --- Render the main component ---
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <Header />
          <BulkActions />
          <RollNoEntry onApply={handlePresentByRollNo} />
          <StudentList />
          <AttendanceSummary />
          <Footer />
        </div>
      </div>
    </div>
  );
}

