import React from 'react';

const Schedule = () => {
  // Dummy data for a faculty member's schedule
  const scheduleData = {
    "9:00 - 10:00": { Monday: "CSE201 (A-301)", Tuesday: "", Wednesday: "CSE201 (A-301)", Thursday: "", Friday: "CSE201 (A-301)" },
    "10:00 - 11:00": { Monday: "CSE203 (A-303)", Tuesday: "CSE203 (A-303)", Wednesday: "", Thursday: "CSE203 (A-303)", Friday: "" },
    "11:00 - 12:00": { Monday: "", Tuesday: "CSE205 (Lab)", Wednesday: "CSE205 (Lab)", Thursday: "", Friday: "CSE205 (Lab)" },
    "12:00 - 1:00": { Monday: "Break", Tuesday: "Break", Wednesday: "Break", Thursday: "Break", Friday: "Break" },
    "1:00 - 2:00": { Monday: "B.Tech Project", Tuesday: "", Wednesday: "B.Tech Project", Thursday: "", Friday: "" },
  };
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = Object.keys(scheduleData);

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-6 tracking-tight">My Weekly Schedule</h2>
      <div className="bg-white rounded-xl shadow-md border overflow-x-auto">
        <table className="w-full text-center">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 font-semibold text-slate-600 border-r">Time</th>
              {days.map(day => <th key={day} className="p-3 font-semibold text-slate-600 border-r">{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(time => (
              <tr key={time} className="border-t">
                <td className="p-3 font-semibold text-sm border-r">{time}</td>
                {days.map(day => (
                  <td key={day} className={`p-3 border-r ${scheduleData[time][day] === 'Break' ? 'bg-slate-50 font-medium' : ''}`}>
                    {scheduleData[time][day] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;
