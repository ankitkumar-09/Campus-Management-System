import React, { useState, useEffect, useMemo } from "react";
import Layout from "./Layout";
import { 
    FaPlus, FaEllipsisV, FaArrowLeft, FaEye, FaBuilding, FaGraduationCap, FaEnvelope, 
    FaPhone, FaBirthdayCake, FaVenusMars, FaMapMarkedAlt, FaFilter, FaUser, 
    FaBriefcase, FaSearch, FaSpinner, FaExclamationTriangle, FaPencilAlt, FaTrash, FaSortAmountDown 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✨ UI ENHANCEMENT: Reusable components with modern styling
const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-4 py-4">
        <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 ring-4 ring-indigo-50">{icon}</div>
        <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="text-md font-semibold text-slate-800 break-words">{value || "N/A"}</p>
        </div>
    </div>
);

const FormInput = ({ id, label, icon, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">{icon}</div>
            <input id={id} {...props} 
                   className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 text-slate-800 rounded-lg transition duration-200 ease-in-out
                              focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                              placeholder:text-slate-400 disabled:bg-slate-200 disabled:cursor-not-allowed" />
        </div>
    </div>
);

// ✨ UI ENHANCEMENT: Animation variants
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } }};
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }};

const Faculty = () => {
    // ✅ All state management and API logic is unchanged.
    const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/admin`;
    const [facultyList, setFacultyList] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(null);
    const [editingEmail, setEditingEmail] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);
    const [sortOrder, setSortOrder] = useState("name-asc");
    const [filterDept, setFilterDept] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [detailsDepartmentName, setDetailsDepartmentName] = useState('');
    const initialFormData = { name: "", department_id: "", degree: "", designation: "", email: "", dob: "", contact_number: "", address: "", gender: "Male", profileImage: null, imageFile: null };
    const [formData, setFormData] = useState(initialFormData);

    const getProfileImageUrl = (faculty) => faculty.profile_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(faculty.name) || '?'}&background=random&color=fff`;

    const fetchData = async () => {
        setIsLoading(true); setError(null);
        try {
            const [deptRes, facultyRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/get-all-departments`),
                axios.get(`${API_BASE_URL}/get-all-faculty`)
            ]);
            setDepartments(deptRes.data);
            setFacultyList(facultyRes.data);
        } catch (err) {
            const errorMessage = "Failed to fetch data. Please try again later.";
            setError(errorMessage); toast.error(errorMessage); console.error(err);
        } finally { setIsLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const filteredAndSortedFaculty = useMemo(() => facultyList
        .filter(faculty => (filterDept === "All" || faculty.department_id === filterDept) && faculty.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            switch (sortOrder) {
                case 'name-desc': return b.name.localeCompare(a.name);
                case 'degree-desc': return (b.degree || '').localeCompare(a.degree || '');
                case 'degree-asc': return (a.degree || '').localeCompare(b.degree || '');
                case 'name-asc': default: return a.name.localeCompare(b.name);
            }
        }), [facultyList, filterDept, searchTerm, sortOrder]);

    const handleInputChange = (e) => {
        const { id, name, value, files } = e.target;
        if (id === "profileImage" && files[0]) {
            if (formData.profileImage && formData.profileImage.startsWith('blob:')) { URL.revokeObjectURL(formData.profileImage); }
            setFormData(prev => ({ ...prev, profileImage: URL.createObjectURL(files[0]), imageFile: files[0] }));
        } else { setFormData(prev => ({ ...prev, [id || name]: value })); }
    };
    
    useEffect(() => {
        const imageUrl = formData.profileImage;
        return () => { if (imageUrl && imageUrl.startsWith('blob:')) { URL.revokeObjectURL(imageUrl); }};
    }, [formData.profileImage]);

    const handleCancel = () => { setFormData(initialFormData); setShowForm(false); setEditingEmail(null); };

    const handleSave = async (e) => {
        e.preventDefault(); setIsSubmitting(true); 
        const apiFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'imageFile' && value) apiFormData.append('profileImage', value);
            else if (!['profileImage', 'imageFile'].includes(key) && value) apiFormData.append(key, value);
        });
        const isEditing = !!editingEmail;
        const url = isEditing ? `${API_BASE_URL}/update-faculty/${editingEmail}` : `${API_BASE_URL}/add-faculty`;
        try {
            await axios({ method: isEditing ? 'put' : 'post', url, data: apiFormData, headers: { 'Content-Type': 'multipart/form-data' }});
            toast.success(`Faculty ${isEditing ? 'updated' : 'added'} successfully!`); handleCancel(); fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} faculty.`);
            console.error(`Failed to save faculty:`, error);
        } finally { setIsSubmitting(false); }
    };

    const handleEdit = (faculty) => {
        setEditingEmail(faculty.email);
        setFormData({ ...faculty, dob: faculty.dob ? new Date(faculty.dob).toISOString().split('T')[0] : "", profileImage: faculty.profile_image_url, imageFile: null });
        setShowForm(true); setMenuOpen(null);
    };

    const handleDelete = async (email) => {
        if (window.confirm("Are you sure? This action cannot be undone.")) {
            try {
                await axios.delete(`${API_BASE_URL}/delete-faculty/${email}`);
                toast.success("Faculty deleted successfully!"); fetchData();
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete faculty.");
                console.error("Failed to delete faculty:", error);
            }
        }
        setMenuOpen(null);
    };
    
    const handleViewDetails = async (faculty) => {
        setShowDetails(faculty); setDetailsDepartmentName('Loading...');
        try {
            const res = await axios.get(`${API_BASE_URL}/get-department/${faculty.department_id}`);
            setDetailsDepartmentName(res.data.department_name);
        } catch (error) {
            console.error("Failed to fetch department details:", error);
            setDetailsDepartmentName("Unknown Department");
        }
    };
    
    // ✨ UI ENHANCEMENT: Restyled Loading, Error, and No-Results states
    const renderContent = () => {
        if (isLoading) return <div className="flex justify-center items-center py-20"><FaSpinner className="text-5xl text-indigo-500 animate-spin" /></div>;
        if (error) return (
            <div className="text-center py-16 px-6 bg-red-50/50 rounded-xl shadow-sm border border-red-200">
                <FaExclamationTriangle className="mx-auto text-5xl text-red-400 mb-4" />
                <h3 className="text-xl font-semibold text-red-700">An Error Occurred</h3>
                <p className="text-red-500 mt-1">{error}</p>
            </div>
        );
        if (filteredAndSortedFaculty.length === 0) return (
            <div className="text-center py-16 px-6 bg-white/70 rounded-xl shadow-sm border border-slate-200">
                <FaSearch className="mx-auto text-5xl text-slate-400 mb-4" />
                <h3 className="text-xl font-semibold text-slate-700">No Records Found</h3>
                <p className="text-slate-500 mt-1">Try adjusting your search or filters.</p>
            </div>
        );
        return (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                {filteredAndSortedFaculty.map((faculty) => {
                    const departmentName = departments.find(d => d.department_id === faculty.department_id)?.department_name || '...';
                    return (
                        <motion.div key={faculty.faculty_id || faculty.email} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white/60 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 relative flex flex-col hover:-translate-y-1.5 border border-slate-200/50 items-center text-center">
                            <div className="absolute top-3 right-3">
                                <button onClick={() => setMenuOpen(menuOpen === faculty.email ? null : faculty.email)} className="p-1.5 rounded-full text-slate-500 hover:bg-slate-200/70 transition"><FaEllipsisV /></button>
                                <AnimatePresence>{menuOpen === faculty.email && (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                        className="absolute right-0 bg-white border rounded-lg shadow-xl mt-2 z-10 w-36 overflow-hidden text-left">
                                        <button onClick={() => handleEdit(faculty)} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-100 text-sm font-medium"><FaPencilAlt size={12}/> Edit</button>
                                        <button onClick={() => handleDelete(faculty.email)} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-100 text-red-600 text-sm font-medium"><FaTrash size={12}/> Delete</button>
                                    </motion.div>
                                )}</AnimatePresence>
                            </div>
                            <img src={getProfileImageUrl(faculty)} alt={faculty.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-200 mb-4 bg-slate-200" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(faculty.name)}`}}/>
                            <h3 className="text-lg font-bold text-slate-800">{faculty.name}</h3>
                            <p className="text-sm text-indigo-600 font-medium">{faculty.designation}</p>
                            <div className="text-sm text-slate-600 mt-3 border-t pt-3 flex-grow w-full space-y-1">
                                <p className="flex items-center justify-center gap-2"><FaBuilding className="text-slate-400"/> {departmentName}</p>
                                <p className="flex items-center justify-center gap-2"><FaGraduationCap className="text-slate-400"/> {faculty.degree}</p>
                            </div>
                            <motion.button onClick={() => handleViewDetails(faculty)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-4 w-full font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                                <FaEye/> View Details
                            </motion.button>
                        </motion.div>
                    );
                })}
                </AnimatePresence>
            </motion.div>
        );
    };

    return (
        <Layout>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
            <div className="bg-gradient-to-br from-gray-50 to-blue-100 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
                {/* ✨ UI ENHANCEMENT: Fancy gradient header and button */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                    <h2 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">Faculty Management</h2>
                    <motion.button onClick={() => { setEditingEmail(null); setFormData({ ...initialFormData, department_id: departments[0]?.department_id || '' }); setShowForm(true); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-500/30">
                        <FaPlus /> Add New Faculty
                    </motion.button>
                </div>

                {/* ✨ UI ENHANCEMENT: Restyled control panel */}
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-md border mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label htmlFor="search" className="text-sm font-medium text-slate-600 flex items-center gap-2 mb-1.5"><FaSearch /> Search by Name</label>
                        <input id="search" type="text" placeholder="Enter faculty name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border-slate-300 p-2 rounded-lg bg-white/80 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition" />
                    </div>
                    <div>
                        <label htmlFor="filterDept" className="text-sm font-medium text-slate-600 flex items-center gap-2 mb-1.5"><FaFilter /> Filter by Department</label>
                        <select id="filterDept" value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="w-full border-slate-300 p-2 rounded-lg bg-white/80 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition">
                            <option value="All">All Departments</option>
                            {departments.map(dept => <option key={dept.department_id} value={dept.department_id}>{dept.department_name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sortOrder" className="text-sm font-medium text-slate-600 flex items-center gap-2 mb-1.5"><FaSortAmountDown/> Sort By</label>
                        <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full border-slate-300 p-2 rounded-lg bg-white/80 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition">
                            <option value="name-asc">Name (A-Z)</option><option value="name-desc">Name (Z-A)</option>
                            <option value="degree-asc">Degree (A-Z)</option><option value="degree-desc">Degree (Z-A)</option>
                        </select>
                    </div>
                </div>
                
                {renderContent()}
            </div>

            {/* ✨ UI ENHANCEMENT: Fancy Add/Edit Form Modal with animations */}
            <AnimatePresence>{showForm && (
                <motion.div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="bg-white w-full max-w-3xl p-6 sm:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] ring-1 ring-gray-900/5"
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                        <h3 className="text-2xl font-bold mb-6 text-center text-slate-800">{editingEmail ? "Edit Faculty" : "Add New Faculty"}</h3>
                        <motion.form onSubmit={handleSave} variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                            <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
                                <img src={formData.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name) || '?'}&background=random&color=fff`} alt="Profile" className="w-28 h-28 rounded-full object-cover ring-4 ring-indigo-200 bg-slate-200"/>
                                <label htmlFor="profileImage" className="cursor-pointer text-sm font-semibold text-indigo-600 bg-indigo-50 py-2 px-4 rounded-full hover:bg-indigo-100 transition">
                                    {formData.imageFile ? "Change Photo" : "Upload Photo"}
                                </label>
                                <input id="profileImage" type="file" accept="image/*" onChange={handleInputChange} className="hidden"/>
                            </motion.div>
                            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <FormInput id="name" label="Full Name" type="text" value={formData.name} onChange={handleInputChange} required icon={<FaUser />} placeholder="e.g., Dr. Meena Sharma"/>
                                <FormInput id="designation" label="Designation" type="text" value={formData.designation} onChange={handleInputChange} required icon={<FaBriefcase />} placeholder="e.g., Professor"/>
                                <div>
                                    <label htmlFor="department_id" className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
                                    <select id="department_id" name="department_id" value={formData.department_id} onChange={handleInputChange} required className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
                                        <option value="">Select Department</option>
                                        {departments.map(d => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}
                                    </select>
                                </div>
                                <FormInput id="degree" label="Degree" type="text" value={formData.degree} onChange={handleInputChange} required icon={<FaGraduationCap />} placeholder="e.g., Ph.D. in AI"/>
                                <FormInput id="email" label="Email Address" type="email" value={formData.email} onChange={handleInputChange} required icon={<FaEnvelope />} placeholder="name@college.edu" disabled={!!editingEmail}/>
                                <FormInput id="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleInputChange} icon={<FaBirthdayCake />} />
                                <FormInput id="contact_number" label="Contact Number" type="tel" value={formData.contact_number} onChange={handleInputChange} icon={<FaPhone />} placeholder="e.g., 9876543210"/>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                                    <div className="flex items-center gap-6 pt-1.5">
                                        <label className="flex items-center gap-2"><input type="radio" value="Male" name="gender" checked={formData.gender === "Male"} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"/>Male</label>
                                        <label className="flex items-center gap-2"><input type="radio" value="Female" name="gender" checked={formData.gender === "Female"} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"/>Female</label>
                                        <label className="flex items-center gap-2"><input type="radio" value="Other" name="gender" checked={formData.gender === "Other"} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"/>Other</label>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                                    <textarea id="address" name="address" value={formData.address || ''} onChange={handleInputChange} rows="3" placeholder="Enter full address" className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"/>
                                </div>
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex justify-end gap-4 pt-4">
                                <motion.button type="button" onClick={handleCancel} disabled={isSubmitting} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2.5 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold transition disabled:opacity-50">Cancel</motion.button>
                                <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition disabled:opacity-70 disabled:cursor-wait">
                                    {isSubmitting ? <><FaSpinner className="animate-spin" /> Saving...</> : "Save Faculty"}
                                </motion.button>
                            </motion.div>
                        </motion.form>
                    </motion.div>
                </motion.div>
            )}</AnimatePresence>

            {/* ✨ UI ENHANCEMENT: Fancy Details View Panel */}
            <AnimatePresence>{showDetails && (
                <motion.div className="fixed inset-0 bg-white overflow-y-auto z-50" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                    <div className="p-6 sm:p-10">
                        <motion.button onClick={() => setShowDetails(null)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition font-semibold mb-8"><FaArrowLeft /> Back to List</motion.button>
                        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-8 rounded-xl text-white flex flex-col sm:flex-row items-center text-center sm:text-left gap-6">
                            <img src={getProfileImageUrl(showDetails)} alt={showDetails.name} className="w-32 h-32 rounded-full object-cover ring-4 ring-white/30 bg-slate-200 flex-shrink-0"/>
                            <div>
                                <h2 className="text-4xl font-bold tracking-tight">{showDetails.name}</h2>
                                <p className="text-indigo-200 font-semibold mt-1 text-lg">{showDetails.designation}</p>
                            </div>
                        </div>
                        <div className="mt-8 divide-y divide-slate-200">
                            <DetailItem icon={<FaBuilding />} label="Department" value={detailsDepartmentName} />
                            <DetailItem icon={<FaGraduationCap />} label="Degree" value={showDetails.degree} />
                            <DetailItem icon={<FaEnvelope />} label="Email" value={showDetails.email} />
                            <DetailItem icon={<FaPhone />} label="Contact" value={showDetails.contact_number} />
                            <DetailItem icon={<FaBirthdayCake />} label="Date of Birth" value={showDetails.dob ? new Date(showDetails.dob).toLocaleDateString() : 'N/A'} />
                            <DetailItem icon={<FaVenusMars />} label="Gender" value={showDetails.gender} />
                            <DetailItem icon={<FaMapMarkedAlt />} label="Address" value={showDetails.address} />
                        </div>
                    </div>
                </motion.div>
            )}</AnimatePresence>
        </Layout>
    );
};

export default Faculty;