import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaFilePdf } from 'react-icons/fa';

const Result = () => {
  const [openSemester, setOpenSemester] = useState(1); // Default open semester

  const resultsData = [
    {
      semester: 1,
      sgpa: 8.5,
      cgpa: 8.5,
      subjects: [
        { name: 'Introduction to Programming', grade: 'A', result: 'Pass' },
        { name: 'Calculus', grade: 'B+', result: 'Pass' },
        { name: 'Physics for Engineers', grade: 'A', result: 'Pass' },
      ],
    },
    {
      semester: 2,
      sgpa: 8.8,
      cgpa: 8.65,
      subjects: [
        { name: 'Data Structures', grade: 'A+', result: 'Pass' },
        { name: 'Discrete Mathematics', grade: 'A', result: 'Pass' },
        { name: 'Digital Electronics', grade: 'B', result: 'Pass' },
      ],
    },
    {
      semester: 3,
      sgpa: 9.1,
      cgpa: 8.8,
      subjects: [
        { name: 'Operating Systems', grade: 'A', result: 'Pass' },
        { name: 'DBMS', grade: 'A+', result: 'Pass' },
        { name: 'Computer Networks', grade: 'B+', result: 'Pass' },
      ],
    },
  ];

  return (
    <div className="p-2">
      <h2 className="text-3xl font-bold text-slate-800 mb-6 tracking-tight">Semester Results</h2>
      <div className="space-y-4">
        {resultsData.map((result) => (
          <div key={result.semester} className="bg-white rounded-xl shadow-md border overflow-hidden">
            <button
              onClick={() => setOpenSemester(openSemester === result.semester ? null : result.semester)}
              className="w-full p-4 text-left flex justify-between items-center hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg text-blue-600">Semester {result.semester}</span>
                <div className="text-sm">
                  <span className="font-semibold">SGPA:</span> {result.sgpa.toFixed(2)} | <span className="font-semibold">CGPA:</span> {result.cgpa.toFixed(2)}
                </div>
              </div>
              {openSemester === result.semester ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <AnimatePresence>
              {openSemester === result.semester && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="p-2 text-left">Subject</th>
                          <th className="p-2">Grade</th>
                          <th className="p-2">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.subjects.map(subject => (
                          <tr key={subject.name} className="border-b">
                            <td className="p-2">{subject.name}</td>
                            <td className="p-2 text-center font-semibold">{subject.grade}</td>
                            <td className={`p-2 text-center font-bold ${subject.result === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>{subject.result}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                     <button className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800">
                        <FaFilePdf /> Download Marksheet
                     </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Result;
