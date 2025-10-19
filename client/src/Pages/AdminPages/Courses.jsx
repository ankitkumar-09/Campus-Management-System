import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { 
    FaPlus, FaEllipsisV, FaArrowLeft, FaEye, FaBook, FaCode, FaUniversity, 
    FaTrash, FaCalendarAlt, FaHashtag, FaEdit, FaSpinner, FaTimes, FaPencilAlt, FaStream 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

// ✨ UI ENHANCEMENT: Reusable Components with modern styling
const FormInput = ({ id, label, type, value, onChange, placeholder, required, icon }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">{icon}</div>
            <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} 
                   className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 text-slate-800 rounded-lg transition duration-200 ease-in-out
                              focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                              placeholder:text-slate-400" 
                   required={required} />
        </div>
    </div>
);

// ✨ FIX: Adjusted DetailItem for better layout and to avoid division line overlap
const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-4 py-4 md:py-0 md:px-4 first:pl-0 last:pr-0"> {/* Added padding for columns and removed vertical padding */}
        <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 ring-4 ring-indigo-50">{icon}</div>
        <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="text-md font-semibold text-slate-800">{value || "N/A"}</p>
        </div>
    </div>
);

// ✨ UI ENHANCEMENT: Animation variants for smooth staggered effects
const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

// Main Component
const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);
    const [formData, setFormData] = useState({ name: "", code: "", duration: "", totalSemesters: "", department: "", branches: [] });
    const [viewingBranch, setViewingBranch] = useState(null);

    // ✅ All state management and API logic is unchanged.
    const fetchDepartments = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-all-departments`);
            const mappedData = res.data.map(dept => dept.department_name);
            setDepartments(mappedData);
            if (!editingId) {
                setFormData(prev => ({ ...prev, department: mappedData[0] || "" }));
            }
        } catch (err) { console.error("Error fetching departments:", err); }
    };
    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-all-courses`);
            const mappedCourses = res.data.map(course => ({
                id: course.course_id, name: course.course_name, code: course.course_code, department: course.department,
                duration: course.duration_years, totalSemesters: course.total_semesters, branches: [] 
            }));
            setCourses(mappedCourses);
        } catch (err) { console.error("Error fetching courses:", err); }
    };
    useEffect(() => { fetchDepartments(); fetchCourses(); }, []);
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    const handleBranchChange = (index, field, value) => {
        const updatedBranches = [...formData.branches];
        updatedBranches[index][field] = value;
        setFormData(prev => ({ ...prev, branches: updatedBranches }));
    };
    const addBranch = () => {
        setFormData(prev => ({ ...prev, branches: [...prev.branches, { id: `temp-${uuidv4()}`, name: "", description: "" }] }));
    };
    const removeBranch = (index) => {
        setFormData(prev => ({ ...prev, branches: prev.branches.filter((_, i) => i !== index) }));
    };
    const handleCancel = () => {
        setFormData({ name: "", code: "", duration: "", totalSemesters: "", department: departments[0] || "", branches: [] });
        setShowForm(false);
        setEditingId(null);
    };
    const handleSave = async (e) => {
        e.preventDefault();
        const courseDataForAPI = {
            course_name: formData.name, course_code: formData.code, department: formData.department,
            duration_years: formData.duration, total_semesters: formData.totalSemesters,
            branches: formData.branches.map(b => ({
                branch_id: String(b.id).startsWith('temp-') ? undefined : b.id,
                branch_name: b.name, description: b.description
            }))
        };
        try {
            if (editingId) {
                await axios.put(`${import.meta.env.VITE_BACKEND_URL}/admin/update-course/${editingId}`, courseDataForAPI);
            } else {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/add-new-course`, courseDataForAPI);
            }
            fetchCourses(); handleCancel();
        } catch (err) { console.error("Error saving course:", err); }
    };
    const handleEdit = (course) => {
        setEditingId(course.id);
        handleViewDetails(course, (fetchedCourseWithBranches) => {
            setFormData(fetchedCourseWithBranches);
        });
        setShowForm(true); setMenuOpen(null);
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/delete-course/${id}`);
            fetchCourses(); setMenuOpen(null);
        } catch (err) { console.error("Error deleting course:", err); }
    };
    const handleRemoveBranchFromDetails = async (branchId) => {
        if (!window.confirm("Delete this branch?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/delete-branch/${branchId}`);
            if (showDetails) { handleViewDetails(showDetails); }
        } catch (err) { console.error("Error removing branch:", err); }
    };
    const handleViewDetails = async (course, callback) => {
        try {
            if (!callback) { setShowDetails({ ...course, branches: [], isLoading: true }); }
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-branches/${course.id}`);
            const mappedBranches = res.data.map(b => ({ id: b.branch_id, name: b.branch_name, description: b.description }));
            const courseWithBranches = { ...course, branches: mappedBranches, isLoading: false };
            if (callback) { callback(courseWithBranches); } else { setShowDetails(courseWithBranches); }
        } catch (error) {
            console.error("Failed to fetch branches:", error);
            const errorState = { ...course, branches: [], isLoading: false };
            if (error.response && error.response.status === 404) {
                if (callback) { callback(errorState); } else { setShowDetails(errorState); }
            } else {
                errorState.error = "Could not load branches.";
                if (callback) { callback(errorState); } else { setShowDetails(errorState); }
            }
        }
    };

    return (
        <Layout>
            <div className="bg-gradient-to-br from-gray-50 to-blue-100 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
                {/* ✨ FIX: Adjusted padding on the header for better spacing */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4 px-2 sm:px-0"> {/* Added horizontal padding */}
                    <h2 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">Manage Courses</h2>
                    <motion.button onClick={() => { setEditingId(null); setFormData({ name: "", code: "", duration: "", totalSemesters: "", department: departments[0] || "", branches: [] }); setShowForm(true); }}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-500/30">
                        <FaPlus /> Add Course
                    </motion.button>
                </div>

                {/* ✨ UI ENHANCEMENT: Grid with glassmorphism cards */}
                <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <motion.div key={course.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="bg-white/60 backdrop-blur-lg p-5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 relative flex flex-col hover:-translate-y-1.5 border border-slate-200/50">
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-slate-800 pr-4">{course.name}</h3>
                                    <div className="relative">
                                        <button onClick={() => setMenuOpen(menuOpen === course.id ? null : course.id)} className="p-1.5 rounded-full text-slate-500 hover:bg-slate-200/70 transition"><FaEllipsisV /></button>
                                        <AnimatePresence>
                                            {menuOpen === course.id && (
                                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                                    className="absolute right-0 bg-white border rounded-lg shadow-xl mt-2 z-10 w-36 overflow-hidden">
                                                    <button onClick={() => handleEdit(course)} className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-100 text-sm font-medium"><FaPencilAlt size={12} /> Edit</button>
                                                    <button onClick={() => handleDelete(course.id)} className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-100 text-red-600 text-sm font-medium"><FaTrash size={12}/> Delete</button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-600 mt-2 space-y-2 border-t pt-3">
                                    <p className="flex items-center gap-2.5"><FaCode className="text-slate-400"/> Code: <span className="font-semibold">{course.code}</span></p>
                                    <p className="flex items-center gap-2.5"><FaUniversity className="text-slate-400"/> Dept: <span className="font-semibold">{course.department}</span></p>
                                </div>
                            </div>
                            <motion.button onClick={() => handleViewDetails(course)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="mt-4 flex items-center justify-center gap-2 w-full font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors">
                                <FaEye /> View Details
                            </motion.button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* ✨ UI ENHANCEMENT: Fancy Add/Edit Form Modal with animations */}
            <AnimatePresence>{showForm && (
                <motion.div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="bg-white w-full max-w-3xl p-6 sm:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] ring-1 ring-gray-900/5"
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                        <h3 className="text-2xl font-bold mb-6 text-center text-slate-800">{editingId ? "Edit Course" : "Add New Course"}</h3>
                        <motion.form onSubmit={handleSave} variants={containerVariants} initial="hidden" animate="show">
                            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput id="name" label="Course Name" type="text" value={formData.name} onChange={handleInputChange} required icon={<FaBook />} placeholder="e.g., Bachelor of Technology" />
                                <FormInput id="code" label="Course Code" type="text" value={formData.code} onChange={handleInputChange} required icon={<FaCode />} placeholder="e.g., BTECH" />
                                <FormInput id="duration" label="Duration (Years)" type="number" value={formData.duration} onChange={handleInputChange} required icon={<FaCalendarAlt />} placeholder="e.g., 4" />
                                <FormInput id="totalSemesters" label="Total Semesters" type="number" value={formData.totalSemesters} onChange={handleInputChange} required icon={<FaHashtag />} placeholder="e.g., 8" />
                                <div className="md:col-span-2">
                                    <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><FaUniversity/></div>
                                        <select id="department" value={formData.department} onChange={handleInputChange} className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
                                            {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div variants={itemVariants} className="mt-8 border-t pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-lg font-bold text-slate-700">Course Branches</h4>
                                    <motion.button type="button" onClick={addBranch} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded-md flex items-center gap-1.5">+ Add</motion.button>
                                </div>
                                <motion.div layout className="space-y-4">
                                    <AnimatePresence>
                                    {formData.branches && formData.branches.map((branch, index) => (
                                        <motion.div layout key={branch.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                                            className="bg-slate-50/70 p-4 rounded-lg border flex items-start gap-4">
                                            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input type="text" placeholder="Branch Name (e.g., CSE)" value={branch.name} onChange={(e) => handleBranchChange(index, 'name', e.target.value)} className="w-full p-2 bg-white border-slate-300 rounded-md focus:ring-indigo-500/50 focus:border-indigo-500 focus:ring-1 transition" required />
                                                <input type="text" placeholder="Description (Optional)" value={branch.description} onChange={(e) => handleBranchChange(index, 'description', e.target.value)} className="w-full p-2 bg-white border-slate-300 rounded-md focus:ring-indigo-500/50 focus:border-indigo-500 focus:ring-1 transition" />
                                            </div>
                                            <motion.button type="button" onClick={() => removeBranch(index)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-red-500 hover:text-red-700 p-2"><FaTrash /></motion.button>
                                        </motion.div>
                                    ))}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex justify-end gap-4 mt-8">
                                <motion.button type="button" onClick={handleCancel} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2.5 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition font-semibold">Cancel</motion.button>
                                <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-xl transition font-semibold shadow-lg shadow-indigo-500/30">Save Course</motion.button>
                            </motion.div>
                        </motion.form>
                    </motion.div>
                </motion.div>
            )}</AnimatePresence>
            
            {/* ✨ UI ENHANCEMENT: Fancy Details View Panel */}
            <AnimatePresence>{showDetails && (
                <motion.div className="fixed inset-0 bg-white overflow-y-auto p-6 sm:p-10 z-50" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                    <motion.button onClick={() => setShowDetails(null)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition font-semibold mb-8"><FaArrowLeft /> Back to List</motion.button>
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-8 rounded-xl text-white flex justify-between items-start">
                        <div>
                            <h2 className="text-4xl font-bold tracking-tight">{showDetails.name}</h2>
                            <p className="text-indigo-200 font-semibold mt-1">CODE: {showDetails.code}</p>
                        </div>
                        <motion.button onClick={() => { handleEdit(showDetails); setShowDetails(null); }} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition text-sm font-semibold backdrop-blur-sm"><FaEdit /> Edit</motion.button>
                    </div>
                    {/* ✨ FIX: Adjusted grid and divide styling to prevent overlap */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-y-0 md:divide-x divide-slate-200"> {/* Removed gap-x-6, adjusted gap-y */}
                        <DetailItem icon={<FaUniversity />} label="Department" value={showDetails.department} />
                        <DetailItem icon={<FaCalendarAlt />} label="Duration" value={`${showDetails.duration} Years`} />
                        <DetailItem icon={<FaHashtag />} label="Total Semesters" value={showDetails.totalSemesters} />
                    </div>
                    <div className="mt-6 border-t pt-6">
                        <h3 className="text-xl font-bold text-slate-700 mb-4">Branches Offered</h3>
                        <div className="space-y-3">
                            {showDetails.isLoading ? ( <div className="flex items-center gap-2 text-slate-500"><FaSpinner className="animate-spin" /> Loading branches...</div>
                            ) : showDetails.error ? ( <p className="text-red-500">{showDetails.error}</p>
                            ) : showDetails.branches && showDetails.branches.length > 0 ? (
                                showDetails.branches.map(branch => (
                                    <div key={branch.id} className="group w-full text-left bg-slate-50 p-4 rounded-lg border flex justify-between items-center hover:bg-white hover:border-indigo-300 hover:shadow-md transition">
                                        <div onClick={() => setViewingBranch(branch)} className="cursor-pointer flex-grow">
                                            <p className="font-semibold text-indigo-800">{branch.name}</p>
                                            <p className="text-slate-500 text-sm truncate">{branch.description || "Click to view details"}</p>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); handleRemoveBranchFromDetails(branch.id); }} className="text-slate-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition" aria-label={`Delete ${branch.name}`}><FaTrash /></button>
                                    </div>
                                ))
                            ) : (<p className="text-slate-400 p-4 bg-slate-50 rounded-md">No branches available for this course.</p>)}
                        </div>
                    </div>
                </motion.div>
            )}</AnimatePresence>

            {/* ✨ UI ENHANCEMENT: Branch Details Pop-up Modal */}
            <AnimatePresence>{viewingBranch && (
                <motion.div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-[60] p-4" onClick={() => setViewingBranch(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-2xl relative" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setViewingBranch(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition p-2 rounded-full hover:bg-slate-100" aria-label="Close"><FaTimes size={20} /></button>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3"><FaStream className="text-indigo-500"/>{viewingBranch.name}</h3>
                        <div className="border-t mt-4 pt-4">
                            <p className="text-slate-600 whitespace-pre-wrap">{viewingBranch.description || "No description provided."}</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}</AnimatePresence>
        </Layout>
    );
};

export default Courses;