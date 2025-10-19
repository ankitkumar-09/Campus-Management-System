import React, { useState, useEffect, useMemo } from 'react';
import Layout from './Layout';

const allStudentsData = [
  { id: 1, universityId: '2100101', name: 'Aarav Sharma', course: 'B.Tech CSE', semester: 3, admissionYear: 2021, contact: '9876543210', avatar: 'AS' },
  { id: 2, universityId: '2100102', name: 'Vivaan Singh', course: 'B.Tech CSE', semester: 3, admissionYear: 2021, contact: '9876543211', avatar: 'VS' },
  { id: 3, universityId: '2100103', name: 'Aditya Kumar', course: 'B.Tech CSE', semester: 5, admissionYear: 2020, contact: '9876543212', avatar: 'AK' },
  { id: 4, universityId: '2100104', name: 'Vihaan Gupta', course: 'B.Tech CSE', semester: 5, admissionYear: 2020, contact: '9876543213', avatar: 'VG' },
  { id: 5, universityId: '2205301', name: 'Priya Verma', course: 'BCA', semester: 3, admissionYear: 2022, contact: '9876543214', avatar: 'PV' },
  { id: 6, universityId: '2205302', name: 'Anika Desai', course: 'BCA', semester: 3, admissionYear: 2022, contact: '9876543215', avatar: 'AD' },
  { id: 7, universityId: '2206112', name: 'Saanvi Joshi', course: 'BBA', semester: 5, admissionYear: 2020, contact: '9876543216', avatar: 'SJ' },
  { id: 8, universityId: '2206113', name: 'Muhammad Khan', course: 'BBA', semester: 1, admissionYear: 2023, contact: '9876543217', avatar: 'MK' },
  { id: 9, universityId: '2206114', name: 'Ananya Roy', course: 'BBA', semester: 1, admissionYear: 2023, contact: '9876543218', avatar: 'AR' },
];

const mockCourses = ['All', 'B.Tech CSE', 'BCA', 'BBA'];
const mockSemesters = ['All', 1, 2, 3, 4, 5, 6, 7, 8];
const mockYears = ['All', 2023, 2022, 2021, 2020];

const fetchStudentData = () => new Promise(resolve => setTimeout(() => resolve(allStudentsData), 500));

// SVG Icons
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);
const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const EditStudentModal = ({ student, onClose, onSave }) => {
  const [form, setForm] = useState(student);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Student</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Name" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Student ID</label>
            <input name="universityId" value={form.universityId} onChange={handleChange} className="w-full border p-2 rounded" placeholder="University ID" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Course</label>
            <input name="course" value={form.course} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Course" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Semester</label>
            <input name="semester" value={form.semester} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Semester" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Year</label>
            <input name="admissionYear" value={form.admissionYear} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Year" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Contact</label>
            <input name="contact" value={form.contact} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Contact" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchStudentData().then(data => {
      setStudents(data);
      setIsLoading(false);
    });
  }, []);

  const sortedAndFilteredStudents = useMemo(() => {
    let filtered = students
      .filter(s => courseFilter === 'All' || s.course === courseFilter)
      .filter(s => semesterFilter === 'All' || s.semester === semesterFilter)
      .filter(s => yearFilter === 'All' || s.admissionYear === yearFilter)
      .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.universityId.includes(searchTerm));

    if (sortConfig.key !== null) {
      filtered = [...filtered].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [students, courseFilter, semesterFilter, yearFilter, searchTerm, sortConfig]);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Delete student permanently
  const handleDelete = async (id) => {
    // TODO: Replace with your backend API call
    // await fetch(`/api/students/${id}`, { method: 'DELETE' });
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
  };

  const handleSaveEdit = async (updatedStudent) => {
    // TODO: Send updatedStudent to backend with PUT request
    setStudents(prev =>
      prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    setEditingStudent(null);
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Students</h1>
            <p className="text-gray-500 mt-1">Manage student information for GEHU Admin.</p>
          </div>
        </div>
        <div className="p-4 border-b border-gray-200">
          {/* Filter Labels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
            <span className="font-semibold text-gray-600">Search</span>
            <span className="font-semibold text-gray-600">Course Filter</span>
            <span className="font-semibold text-gray-600">Semester Filter</span>
            <span className="font-semibold text-gray-600">Year Filter</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Search by name or ID"
              />
            </div>
            <div>
              <select
                value={courseFilter}
                onChange={e => setCourseFilter(e.target.value)}
                className="w-full border p-2 rounded"
              >
                {mockCourses.map(course => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={semesterFilter}
                onChange={e => setSemesterFilter(e.target.value)}
                className="w-full border p-2 rounded"
              >
                {mockSemesters.map(semester => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={yearFilter}
                onChange={e => setYearFilter(e.target.value)}
                className="w-full border p-2 rounded"
              >
                {mockYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="p-4">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="px-6 py-3" onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>
                  Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '▲▼'}
                </th>
                <th className="px-6 py-3" onClick={() => requestSort('universityId')} style={{ cursor: 'pointer' }}>
                  Student ID {sortConfig.key === 'universityId' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '▲▼'}
                </th>
                <th className="px-6 py-3" onClick={() => requestSort('course')} style={{ cursor: 'pointer' }}>
                  Course {sortConfig.key === 'course' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '▲▼'}
                </th>
                <th className="px-6 py-3" onClick={() => requestSort('semester')} style={{ cursor: 'pointer' }}>
                  Semester {sortConfig.key === 'semester' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '▲▼'}
                </th>
                <th className="px-6 py-3" onClick={() => requestSort('admissionYear')} style={{ cursor: 'pointer' }}>
                  Year {sortConfig.key === 'admissionYear' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '▲▼'}
                </th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center p-8">Loading student data...</td>
                </tr>
              ) : sortedAndFilteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-8">No students found.</td>
                </tr>
              ) : (
                sortedAndFilteredStudents.map(student => (
                  <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                          {student.avatar}
                        </div>
                        <div className="font-bold">{student.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{student.universityId}</td>
                    <td className="px-6 py-4">{student.course}</td>
                    <td className="px-6 py-4">{student.semester}</td>
                    <td className="px-6 py-4">{student.admissionYear}</td>
                    <td className="px-6 py-4">{student.contact}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          className="hover:bg-orange-50 rounded-full p-1"
                          title="Edit Student"
                          onClick={() => handleEdit(student)}
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="hover:bg-red-50 rounded-full p-1"
                          title="Delete Student"
                          onClick={() => handleDelete(student.id)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {editingStudent && (
          <EditStudentModal
            student={editingStudent}
            onClose={() => setEditingStudent(null)}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </Layout>
  );
};

export default Students;