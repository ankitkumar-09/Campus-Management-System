import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

// Dummy data for announcements
const getDummyAnnouncements = () => [
  {
    id: 1,
    title: 'Midterm Exam Schedule Released',
    date: '2025-10-10',
    type: 'Exam',
    description: 'The schedule for the upcoming midterm examinations has been published. All students are advised to check the university portal for the detailed timetable. Exams will commence from the first week of November.',
  },
  {
    id: 2,
    title: 'Annual Sports Fest "Velocity 2025"',
    date: '2025-10-08',
    type: 'Sports',
    description: 'Get ready for the most awaited event of the year! Velocity 2025 is here. Registrations for all sports including Cricket, Football, Basketball, and Athletics are now open. The event will take place from October 20th to October 25th. All students are encouraged to participate and show their sportsmanship.',
  },
  {
    id: 3,
    title: 'Important Notice Regarding Fee Payment Deadline',
    date: '2025-10-05',
    type: 'Fees',
    description: 'This is a long description to demonstrate the "Read More" functionality. The deadline for the payment of semester fees has been extended to October 30th, 2025. Students who fail to pay the fees by the due date will be charged a late fee of Rs. 500. It is mandatory for all students to clear their dues to be eligible for the end-semester examinations. Please ignore this notice if you have already paid the fees. You can pay the fees online through the ERP portal using Net Banking, Debit Card, Credit Card, or UPI. For any fee-related queries, please contact the accounts office during working hours (9 AM to 4 PM). It is crucial to save the receipt after a successful transaction for future reference. The university will not be responsible for any failed transactions if the receipt is not generated.',
  },
];

const getTagClasses = (type) => {
  switch (type) {
    case 'Exam':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'Sports':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'Fees':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-300';
  }
};

const Circulars = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    setAnnouncements(getDummyAnnouncements());
  }, []);

  return (
    <>
      <div className="p-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 tracking-tight">Circulars & Announcements</h2>
        <div className="space-y-5">
          {announcements.map((item) => {
            const isLong = item.description.length > 200;
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="bg-white rounded-lg shadow p-5 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-800">{item.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTagClasses(item.type)}`}>
                    {item.type}
                  </span>
                </div>
                <div className="text-sm text-slate-600 mb-2">{item.date}</div>
                <div className="text-slate-700">
                  {isLong && !isExpanded
                    ? (
                      <>
                        {item.description.slice(0, 200)}...
                        <button
                          className="ml-2 text-blue-600 hover:underline text-xs"
                          onClick={() => setExpandedId(item.id)}
                        >
                          Read More
                        </button>
                      </>
                    )
                    : item.description
                  }
                </div>
                {isLong && isExpanded && (
                  <button
                    className="mt-2 text-blue-600 hover:underline text-xs"
                    onClick={() => setExpandedId(null)}
                  >
                    Show Less
                  </button>
                )}
                <div className="mt-3 text-right">
                  <button
                    className="px-4 py-1 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 text-sm"
                    onClick={() => setSelectedAnnouncement(item)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <AnimatePresence>
        {selectedAnnouncement && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-2xl w-full max-w-2xl"
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">{selectedAnnouncement.title}</h3>
                <button onClick={() => setSelectedAnnouncement(null)} className="text-gray-500 hover:text-gray-800"><FaTimes size={20} /></button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <p className="text-slate-700 whitespace-pre-wrap">{selectedAnnouncement.description}</p>
              </div>
              <div className="p-4 bg-slate-50 text-right rounded-b-lg">
                <button onClick={() => setSelectedAnnouncement(null)} className="px-5 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold transition">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Circulars;