// src/Pages/StudentPages/Assignment.jsx

import React from 'react';
import { FaFilePdf, FaCheck, FaClock } from 'react-icons/fa';

const Assignment = () => {
    const assignments = [
        { title: 'Assignment 1: Linked Lists', subject: 'Data Structures', dueDate: '2025-10-20', status: 'Pending' },
        { title: 'Assignment 3: ER Diagrams', subject: 'Database Management Systems', dueDate: '2025-10-18', status: 'Pending' },
        { title: 'Lab Record Submission', subject: 'Operating Systems', dueDate: '2025-10-15', status: 'Submitted' },
        { title: 'Project Proposal', subject: 'Software Engineering', dueDate: '2025-10-12', status: 'Submitted' },
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Assignments</h2>
            <div className="space-y-4">
                {assignments.map(item => (
                    <div key={item.title} className="p-4 border rounded-lg flex items-center justify-between hover:bg-slate-50 transition">
                        <div className="flex items-center gap-4">
                            <FaFilePdf className="text-3xl text-red-500" />
                            <div>
                                <h3 className="font-semibold text-slate-800">{item.title}</h3>
                                <p className="text-sm text-slate-500">{item.subject}</p>
                                <p className="text-sm text-slate-500">Due: {item.dueDate}</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full ${
                            item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                            {item.status === 'Pending' ? <FaClock /> : <FaCheck />}
                            {item.status}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Assignment;