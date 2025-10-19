import React from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaEdit } from 'react-icons/fa';

const BackExam = () => {
  const backExams = [
    { subject: 'Digital Electronics', code: 'CSE105', status: 'Applied', semester: 2 },
    { subject: 'Engineering Graphics', code: 'ME101', status: 'Not Applied', semester: 1 },
  ];

  return (
    <div className="p-2">
      <h2 className="text-3xl font-bold text-slate-800 mb-6 tracking-tight">Backlog Exams</h2>
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <div className="space-y-4">
          {backExams.map(exam => (
            <div key={exam.code} className="p-4 rounded-lg flex justify-between items-center" style={{ background: exam.status === 'Applied' ? '#f0fdf4' : '#fffbeb' }}>
              <div>
                <h3 className="font-bold text-slate-800">{exam.subject} ({exam.code})</h3>
                <p className="text-sm text-slate-500">Semester {exam.semester}</p>
              </div>
              {exam.status === 'Applied' ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                  <FaCheckCircle /> Applied
                </div>
              ) : (
                <button className="flex items-center gap-2 text-sm font-semibold bg-yellow-400 text-yellow-900 py-2 px-4 rounded-lg hover:bg-yellow-500 transition">
                  <FaEdit /> Apply Now
                </button>
              )}
            </div>
          ))}
          {backExams.length === 0 && (
             <div className="text-center py-10">
                <FaCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-700">No Backlogs</h3>
                <p className="text-slate-500 mt-1">Congratulations! You have no pending back exams.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackExam;
