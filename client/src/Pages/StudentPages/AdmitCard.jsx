import React from 'react';
import { FaDownload, FaIdCard } from 'react-icons/fa';

const AdmitCard = () => {
    const admitCards = [
        { name: 'End Semester Examination - Nov 2025', date: 'Issued on: 01-11-2025' },
        { name: 'Mid Term Examination - Sep 2025', date: 'Issued on: 15-09-2025' },
    ];

    return (
        <div className="p-2">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 tracking-tight">Admit Cards</h2>
            <div className="grid md:grid-cols-2 gap-6">
                {admitCards.map(card => (
                    <div key={card.name} className="bg-white p-6 rounded-xl shadow-md border flex flex-col justify-between items-start">
                        <div>
                            <FaIdCard className="text-4xl text-blue-500 mb-3" />
                            <h3 className="text-lg font-bold text-slate-800">{card.name}</h3>
                            <p className="text-sm text-slate-500 mt-1">{card.date}</p>
                        </div>
                        <button className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
                            <FaDownload /> Download
                        </button>
                    </div>
                ))}
            </div>
             {admitCards.length === 0 && (
                <div className="text-center py-16 px-6 bg-white rounded-xl shadow-sm border">
                    <h3 className="text-xl font-semibold text-slate-700">No Admit Cards Available</h3>
                    <p className="text-slate-500 mt-1">Admit cards will be issued before the examinations.</p>
                </div>
            )}
        </div>
    );
};

export default AdmitCard;
