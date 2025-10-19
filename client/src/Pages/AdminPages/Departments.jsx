import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { 
  FaPlus, FaEllipsisV, FaArrowLeft, FaEye, FaUserTie, FaHashtag, 
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaAlignLeft, FaUniversity, FaBarcode, FaTrash, FaPencilAlt 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// ✨ UI ENHANCEMENT: Refined input component with better focus states
const FormInput = ({ id, label, type, value, onChange, placeholder, required, icon }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        {icon}
      </div>
      <input 
        id={id} 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 text-slate-800 rounded-lg transition duration-200 ease-in-out
                   focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                   placeholder:text-slate-400" 
        required={required} 
      />
    </div>
  </div>
);

// ✨ UI ENHANCEMENT: Animation variants for a smoother staggered effect
const formContainerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};
const formItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [menuOpen, setMenuOpen] = useState(null);
  const [formData, setFormData] = useState({
    id: null, name: "", code: "", hodName: "", hodEmail: "", phone: "", officeLocation: "", description: "",
  });

  // ✅ Fetch all departments (No changes in logic)
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-all-departments`);
      const mappedData = response.data.map(d => ({
        id: d.department_id, name: d.department_name, code: d.dept_code, hodName: d.hod_name,
        hodEmail: d.hod_email, phone: d.phone, officeLocation: d.office_location, description: d.description
      }));
      setDepartments(mappedData);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      alert("An error occurred while fetching departments. Please try again.");
    }
  };

  useEffect(() => {
    fetchDepartments();
    const handleClickOutside = (e) => {
      if (!e.target.closest(".menu-container")) setMenuOpen(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const sortedDepartments = [...departments].sort((a, b) =>
    sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const resetForm = () => {
    setFormData({
      id: null, name: "", code: "", hodName: "", hodEmail: "", phone: "", officeLocation: "", description: ""
    });
    setShowForm(false);
  };
  
  // ✅ Save/Update logic (No changes in logic)
  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.hodEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.hodEmail)) {
      alert('Please enter a valid email address.');
      return;
    }
    const payload = {
      department_name: formData.name, dept_code: formData.code, hod_name: formData.hodName, hod_email: formData.hodEmail,
      phone: formData.phone, office_location: formData.officeLocation, description: formData.description,
    };
    try {
      if (formData.id) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/admin/update-department/${formData.id}`, payload);
        alert('Department updated successfully.');
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/add-department`, payload);
        alert('Department added successfully.');
      }
      resetForm();
      fetchDepartments();
    } catch (error) {
      console.error("Failed to save department:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleEdit = (dept) => {
    setFormData({
      id: dept.id, name: dept.name, code: dept.code, hodName: dept.hodName, hodEmail: dept.hodEmail,
      phone: dept.phone, officeLocation: dept.officeLocation, description: dept.description,
    });
    setShowForm(true);
    setMenuOpen(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/delete-department/${id}`);
        alert('Department deleted successfully.');
        fetchDepartments();
      } catch (error) {
        console.error("Failed to delete department:", error);
        alert("An error occurred while deleting. Please try again.");
      }
    }
    setMenuOpen(null);
  };

  // ✨ UI ENHANCEMENT: Restyled detail item for a cleaner look
  const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-4 py-4">
      <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 ring-4 ring-indigo-50">{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-md font-semibold text-slate-800">{value || "N/A"}</p>
      </div>
    </div>
  );

  return (
    <Layout>
      {/* ✨ UI ENHANCEMENT: Added a subtle gradient background */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-100 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
        
        {/* ✨ UI ENHANCEMENT: Fancy gradient header and button */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <h2 className="text-4xl font-bold tracking-tight text-center sm:text-left bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
            Manage Departments
          </h2>
          <motion.button
            onClick={() => { resetForm(); setShowForm(true); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-500/30 transition-all"
          >
            <FaPlus /> Add Department
          </motion.button>
        </div>

        <div className="mb-6 flex justify-end">
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)} 
            className="border border-slate-300 p-2 rounded-lg text-sm bg-white/80 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="asc">Sort A-Z</option>
            <option value="desc">Sort Z-A</option>
          </select>
        </div>
        
        {/* ✨ UI ENHANCEMENT: Grid with glassmorphism cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedDepartments.map((dept) => (
            <motion.div 
              key={dept.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white/60 backdrop-blur-lg p-5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 relative flex flex-col hover:-translate-y-1.5 border border-slate-200/50"
            >
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-slate-800 pr-4">{dept.name}</h3>
                  <div className="relative menu-container">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === dept.id ? null : dept.id); }} 
                      className="p-1.5 rounded-full text-slate-500 hover:bg-slate-200/70 transition"
                    >
                      <FaEllipsisV />
                    </button>
                    <AnimatePresence>
                      {menuOpen === dept.id && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9, y: -10 }} 
                          animate={{ opacity: 1, scale: 1, y: 0 }} 
                          exit={{ opacity: 0, scale: 0.9 }} 
                          className="absolute right-0 bg-white border rounded-lg shadow-xl mt-2 z-10 w-36 overflow-hidden"
                        >
                          <button onClick={() => handleEdit(dept)} className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-100 text-sm font-medium"><FaPencilAlt size={12} /> Edit</button>
                          <button onClick={() => handleDelete(dept.id)} className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-100 text-red-600 text-sm font-medium"><FaTrash size={12}/> Delete</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="text-sm text-slate-600 mt-2 space-y-2 border-t pt-3">
                  <p className="flex items-center gap-2.5"><FaHashtag className="text-slate-400"/> Code: <span className="font-semibold">{dept.code}</span></p>
                  <p className="flex items-center gap-2.5"><FaUserTie className="text-slate-400"/> HOD: <span className="font-semibold">{dept.hodName || "N/A"}</span></p>
                </div>
              </div>
              <motion.button 
                onClick={() => setShowDetails(dept)} 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 flex items-center justify-center gap-2 w-full font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors duration-300"
              >
                <FaEye /> View Details
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ✨ UI ENHANCEMENT: Fancy Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 p-4" 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white w-full max-w-2xl p-6 sm:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar ring-1 ring-gray-900/5" 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="text-2xl font-bold mb-6 text-center text-slate-800">
                {formData.id ? "Edit Department" : "Add New Department"}
              </h3>
              <motion.form onSubmit={handleSave} variants={formContainerVariants} initial="hidden" animate="show">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <motion.div variants={formItemVariants}><FormInput id="name" label="Department Name" type="text" value={formData.name ||""} onChange={handleInputChange} placeholder="e.g., Computer Science" required icon={<FaUniversity />} /></motion.div>
                  <motion.div variants={formItemVariants}><FormInput id="code" label="Department Code" type="text" value={formData.code ||""} onChange={handleInputChange} placeholder="e.g., CSE101" required icon={<FaBarcode />} /></motion.div>
                  <motion.div variants={formItemVariants}><FormInput id="hodName" label="HOD Name" type="text" value={formData.hodName || ""} onChange={handleInputChange} placeholder="e.g., Dr. Meena Sharma" icon={<FaUserTie />} /></motion.div>
                  <motion.div variants={formItemVariants}><FormInput id="hodEmail" label="HOD Email" type="email" value={formData.hodEmail ||""} onChange={handleInputChange} placeholder="e.g., meena@college.edu" icon={<FaEnvelope />} /></motion.div>
                  <motion.div variants={formItemVariants}><FormInput id="phone" label="Phone" type="tel" value={formData.phone||""} onChange={handleInputChange} placeholder="e.g., 9876543210" icon={<FaPhone />} /></motion.div>
                  <motion.div variants={formItemVariants}><FormInput id="officeLocation" label="Office Location" type="text" value={formData.officeLocation || ""} onChange={handleInputChange} placeholder="e.g., Block A - 204" required icon={<FaMapMarkerAlt />} /></motion.div>
                  <motion.div className="md:col-span-2" variants={formItemVariants}>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                    <div className="relative">
                      <div className="absolute top-3.5 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><FaAlignLeft /></div>
                      <textarea id="description" value={formData.description||""} onChange={handleInputChange} placeholder="A brief summary of the department" rows="4" 
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 text-slate-800 rounded-lg transition duration-200 ease-in-out resize-none
                                   focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 placeholder:text-slate-400" 
                        required 
                      />
                    </div>
                  </motion.div>
                </div>
                <motion.div className="flex justify-end gap-4 mt-8" variants={formItemVariants}>
                  <motion.button type="button" onClick={resetForm} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2.5 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition font-semibold">Cancel</motion.button>
                  <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-xl transition font-semibold shadow-lg shadow-indigo-500/30">
                    Save Department
                  </motion.button>
                </motion.div>
              </motion.form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✨ UI ENHANCEMENT: Fancy Details View Panel */}
      <AnimatePresence>
        {showDetails && (
          <motion.div 
            className="fixed inset-0 bg-white overflow-y-auto p-6 sm:p-10 z-50 custom-scrollbar" 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} 
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.button 
              onClick={() => setShowDetails(null)} 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition font-semibold mb-8"
            >
              <FaArrowLeft /> Back to List
            </motion.button>
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-8 rounded-xl text-white">
              <h2 className="text-4xl font-bold tracking-tight">{showDetails.name}</h2>
              <p className="text-indigo-200 font-semibold mt-1">CODE: {showDetails.code}</p>
            </div>
            <div className="mt-8">
              <div className="divide-y divide-slate-200">
                <DetailItem icon={<FaUserTie />} label="Head of Department" value={showDetails.hodName} />
                <DetailItem icon={<FaEnvelope />} label="Email" value={showDetails.hodEmail} />
                <DetailItem icon={<FaPhone />} label="Phone" value={showDetails.phone} />
                <DetailItem icon={<FaMapMarkerAlt />} label="Office Location" value={showDetails.officeLocation} />
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-medium text-slate-500 mb-2">Description</h3>
                <p className="text-md text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg">{showDetails.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`.custom-scrollbar::-webkit-scrollbar { display: none; } .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </Layout>
  );
};

export default Departments;