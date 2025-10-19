import React from 'react';
import { FaUsers, FaBook, FaRegCalendarAlt, FaBullhorn } from 'react-icons/fa';

const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-gradient-to-br ${color} text-white p-6 rounded-xl shadow-lg flex items-center justify-between`}>
        <div>
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-4xl opacity-50">{icon}</div>
    </div>
);

const FacultyDashboard = () => {

    const stats = [
        { title: "Total Students", value: "120", icon: <FaUsers />, color: "from-blue-500 to-blue-600" },
        { title: "Courses Assigned", value: "4", icon: <FaBook />, color: "from-green-500 to-green-600" },
        { title: "Today's Classes", value: "3", icon: <FaRegCalendarAlt />, color: "from-yellow-500 to-yellow-600" },
    ];

    const announcements = [
        { id: 1, title: "Midterm Exam Schedule Released", date: "2025-10-10" },
        { id: 2, title: "Faculty meeting regarding new curriculum", date: "2025-10-08" },
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6 tracking-tight">
              Welcome, Dr. Sharma
            </h2>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
            </div>

            {/* Announcements & Classes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Announcements */}
                <div className="bg-white p-6 rounded-2xl shadow-md border">
                    <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-3"><FaBullhorn className="text-blue-600"/> Recent Announcements</h3>
                    <div className="space-y-3">
                        {announcements.map(item => (
                            <div key={item.id} className="bg-slate-50 p-4 rounded-lg border">
                                <h4 className="font-semibold text-slate-800">{item.title}</h4>
                                <span className="text-sm text-slate-500">{item.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Today's Schedule */}
                <div className="bg-white p-6 rounded-2xl shadow-md border">
                    <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-3"><FaRegCalendarAlt className="text-green-600"/> Today's Schedule</h3>
                    <div className="space-y-3">
                        <div className="bg-slate-50 p-4 rounded-lg border">
                            <p className="font-semibold">Data Structures (CSE201)</p>
                            <p className="text-sm text-slate-500">10:00 AM - 11:00 AM | Room: A-301</p>
                        </div>
                         <div className="bg-slate-50 p-4 rounded-lg border">
                            <p className="font-semibold">Operating Systems (CSE203)</p>
                            <p className="text-sm text-slate-500">12:00 PM - 1:00 PM | Room: A-303</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;

