import React, { useState, useMemo, useEffect, useCallback, useContext } from "react";
import axios from 'axios';
import Layout from "./Layout";
import {
  FaPlus, FaTimes, FaFileAlt, FaFilter, FaCalendarAlt, FaSortAmountDown, FaTag, FaFileImport, FaEdit, FaTrash
} from 'react-icons/fa';
import { AdminContext } from "../../context/AdminContext";

const formatDateForInput = (date) => {
  return new Date(date).toISOString().slice(0, 10);
};

const getTagClasses = (type) => {
  switch (type) {
    case 'Exam':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Holiday':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Sports':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Fees':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Admission':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { admin } = useContext(AdminContext);
  // console.log(admin.admin.admin_id);
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Others');
  const [file, setFile] = useState(null);

  // Filter and Sort State
  const [filterType, setFilterType] = useState('All');
  const [sortOrder, setSortOrder] = useState('date-desc');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return formatDateForInput(date);
  });
  const [endDate, setEndDate] = useState(formatDateForInput(new Date()));

  // REFACTORED: Centralized function to fetch and normalize announcements
  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/public/get-announcements`);
      if (response.data && response.data.announcements) {
        const normalized = response.data.announcements.map(a => ({
          id: a.announcement_id || a.id,
          title: a.title,
          description: a.description,
          type: a.type,
          date: a.created_at ? formatDateForInput(a.created_at) : null,
          fileURL: a.file_url || null,
          fileName: a.file_url ? a.file_url.split('/').pop() : null
        }));
        setAnnouncements(normalized);
      }
    } catch (err) {
      console.error('Error fetching announcements', err);
      alert('Could not fetch announcements.');
    }
  }, []);

  // Fetch announcements on initial component mount
  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const resetFormState = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setType('Others');
    setFile(null);
  };

  const handleOpenFormModal = (announcement = null) => {
    if (announcement) {
      setEditingId(announcement.id);
      setTitle(announcement.title);
      setDescription(announcement.description);
      setType(announcement.type);
      setFile(null); // File is not editable, must be re-uploaded
    } else {
      resetFormState();
    }
    setIsFormModalOpen(true);
  };

  const handleOpenViewModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsViewModalOpen(true);
  };

  // UPDATED: handleDelete now uses the centralized fetchAnnouncements function
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/delete-announcement/${id}`);
        // Instead of re-fetching manually, call the refactored function
        fetchAnnouncements();
      } catch (err) {
        console.error('Delete failed', err);
        alert('Delete failed');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      return alert('Title and Description are required.');
    }

    setIsSubmitting(true); // Set loading state to true

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('admin_id',admin.admin.admin_id);
    if (file) formData.append('announcement_file', file);

    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/admin/update-announcement/${editingId}`, formData);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/add-announcement`, formData);
      }
      
      alert(`Announcement ${editingId ? 'updated' : 'added'} successfully`);
      setIsFormModalOpen(false);
      resetFormState();
      fetchAnnouncements(); // Refresh the list with the latest data
      
    } catch (err) {
      console.error('Submission failed', err);
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false); // Reset loading state regardless of outcome
    }
  };

  const filteredAndSortedAnnouncements = useMemo(() => {
    return announcements
      .filter(item => filterType === 'All' || item.type === filterType)
      .filter(item => !startDate || !endDate || (item.date >= startDate && item.date <= endDate))
      .sort((a, b) => {
        switch (sortOrder) {
          case 'alpha-asc': return a.title.localeCompare(b.title);
          case 'alpha-desc': return b.title.localeCompare(a.title);
          case 'date-asc': return new Date(a.date) - new Date(b.date);
          default: return new Date(b.date) - new Date(a.date);
        }
      });
  }, [announcements, filterType, sortOrder, startDate, endDate]);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Announcements</h2>
        <button onClick={() => handleOpenFormModal()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all hover:scale-105 active:scale-95">
          <FaPlus /> Add New Announcement
        </button>
      </div>
      
      {/* Filter Section - No changes needed */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-slate-500" />
          <h3 className="text-lg font-bold text-slate-700">Filters & Sorting</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <label htmlFor="filterType" className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1"><FaTag /> Type</label>
            <select id="filterType" value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full px-3 py-2 border border-slate-300 bg-slate-50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All</option><option>Holiday</option><option>Academic</option><option>Sports</option><option>Exam</option><option>Fees</option><option>Admission</option><option>Others</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="sortOrder" className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1"><FaSortAmountDown /> Sort By</label>
            <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full px-3 py-2 border border-slate-300 bg-slate-50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="date-desc">Newest First</option><option value="date-asc">Oldest First</option><option value="alpha-asc">Alphabetical (A-Z)</option><option value="alpha-desc">Alphabetical (Z-A)</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1"><FaCalendarAlt /> Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full text-center bg-slate-50 border border-slate-300 rounded-md shadow-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full text-center bg-slate-50 border border-slate-300 rounded-md shadow-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Announcements List - No changes needed */}
      <div className="space-y-5">
        {filteredAndSortedAnnouncements.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white rounded-xl shadow-sm border border-slate-200">
            <FaFileImport className="mx-auto text-5xl text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700">No Announcements Found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your filters or add a new announcement.</p>
          </div>
        ) : (
          filteredAndSortedAnnouncements.map((item) => {
            const isLongDescription = item.description.length > 200;
            return (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${getTagClasses(item.type)}`}>{item.type}</span>
                    <h3 className="text-lg font-bold text-slate-800 mt-2">{item.title}</h3>
                  </div>
                  <span className="text-sm text-slate-500 font-medium whitespace-nowrap">{item.date}</span>
                </div>
                <p className="text-slate-600 mt-2 mb-4 text-sm">
                  {isLongDescription ? `${item.description.substring(0, 200)}...` : item.description}
                  {isLongDescription && (<button onClick={() => handleOpenViewModal(item)} className="text-blue-600 font-semibold ml-2 hover:underline">Read More</button>)}
                </p>
                {item.fileName && item.fileURL && (<a href={item.fileURL} download={item.fileName} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg p-2 mt-3 hover:bg-blue-100 transition-colors w-max"><FaFileAlt /><span className="font-medium text-sm">{item.fileName}</span></a>)}
                <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-3 mt-4">
                  <button onClick={() => handleOpenFormModal(item)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 font-semibold transition-colors"><FaEdit /> Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 font-semibold transition-colors"><FaTrash /> Delete</button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Form Modal - UPDATED with loading state */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6 relative">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{editingId ? "Edit Announcement" : "Add New Announcement"}</h3>
            <button onClick={() => setIsFormModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 disabled:opacity-50" disabled={isSubmitting}><FaTimes size={20} /></button>
            <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
              {/* Form fields are unchanged */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500" required ></textarea>
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500">
                  <option>Holiday</option><option>Academic</option><option>Sports</option><option>Exam</option><option>Fees</option><option>Admission</option><option>Others</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Upload File (Optional)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <div className="flex text-sm text-gray-600"><label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"><input id="file-upload" type="file" className="sr-only" onChange={(e) => setFile(e.target.files[0])} /><span>Upload a file</span></label><p className="pl-1">or drag and drop</p></div>
                    <p className="text-xs text-gray-500">PDF, DOCX, PNG, JPG</p>
                    {file && <p className="text-sm text-green-600 pt-2 font-semibold">Selected: {file.name}</p>}
                  </div>
                </div>
              </div>
              <div className="text-right pt-2">
                <button 
                  type="submit"
                  disabled={isSubmitting} 
                  className="inline-flex justify-center py-2 px-6 border shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal - No changes needed */}
      {isViewModalOpen && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6 relative">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedAnnouncement.title}</h3>
            <div className="flex items-center gap-4 mb-4 text-sm">
              <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${getTagClasses(selectedAnnouncement.type)}`}>{selectedAnnouncement.type}</span>
              <span className="text-slate-500">{selectedAnnouncement.date}</span>
            </div>
            <div className="max-h-[60vh] overflow-y-auto pr-2 text-slate-700 whitespace-pre-wrap">
              <p>{selectedAnnouncement.description}</p>
            </div>
            <button onClick={() => setIsViewModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><FaTimes size={20} /></button>
            <div className="text-right mt-6">
              <button onClick={() => setIsViewModalOpen(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-4 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Announcements;