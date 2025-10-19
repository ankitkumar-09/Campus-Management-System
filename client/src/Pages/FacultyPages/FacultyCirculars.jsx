import React, { useState } from 'react';

// --- ICON COMPONENTS (replaces react-icons to fix the error) ---
const BullhornIcon = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M256 160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm0 0"></path><path d="M256 32C114.6 32 0 146.6 0 288v28.31C0 348.3 22.1 368 49.31 368H64v64c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-64h192v64c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-64h14.69c27.21 0 49.31-19.7 49.31-49.69V288C512 146.6 397.4 32 256 32zm160 304H96c-17.67 0-32-14.33-32-32 0-80.1 73.49-145.51 163.41-169.15C232.2 132.51 240 125.79 240 117.31v-13.82c-68.83 20.3-121.2 75.64-138.56 142.16C82.02 250.77 64 267.79 64 288c0 8.84 7.16 16 16 16h352c8.84 0 16-7.16 16-16 0-20.21-18.02-37.23-37.44-32.35-17.36-66.52-69.73-121.86-138.56-142.16v13.82c0 8.48 7.8 15.2 12.59 17.56C374.51 174.49 448 239.9 448 320c0 17.67-14.33 32-32 32z"></path>
    </svg>
);

const TimesIcon = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 352 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
    </svg>
);


const FacultyCirculars = () => {
  const [selectedCircular, setSelectedCircular] = useState(null);

  const circularsData = [
    { id: 1, title: 'Midterm Exam Schedule Released', date: '2025-10-10', content: 'The detailed schedule for the upcoming midterm examinations has been published. All faculty members are requested to review and prepare accordingly.' },
    { id: 2, title: 'Faculty meeting regarding new curriculum', date: '2025-10-08', content: 'A mandatory meeting for all faculty of the CSE department will be held on 15th October to discuss the proposed changes to the curriculum for the next academic year.' },
    { id: 3, title: 'Holiday on account of Diwali', date: '2025-10-05', content: 'The university will remain closed from 20th Oct to 25th Oct on account of the Diwali festival.' },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="text-2xl text-blue-600"><BullhornIcon /></div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Circulars & Announcements</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md border">
        <div className="space-y-4">
          {circularsData.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg hover:bg-slate-50 transition">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-800">{item.title}</h3>
                <span className="text-xs text-slate-500 font-medium">{item.date}</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                {`${item.content.substring(0, 150)}...`}
                <button onClick={() => setSelectedCircular(item)} className="text-blue-600 font-semibold ml-2 hover:underline">
                  Read More
                </button>
              </p>
            </div>
          ))}
        </div>
      </div>

      {selectedCircular && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6 relative">
            <h3 className="text-xl font-bold">{selectedCircular.title}</h3>
            <p className="text-sm text-slate-500 mb-4">Date: {selectedCircular.date}</p>
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <p>{selectedCircular.content}</p>
            </div>
            <button onClick={() => setSelectedCircular(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><TimesIcon /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyCirculars;

