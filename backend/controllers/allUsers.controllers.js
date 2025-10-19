const bcrypt = require('bcrypt');
const util = require('util');
const connDB=require('../db/db.conn');
const query = util.promisify(connDB.query).bind(connDB);

exports.getAllSubject=async(req,res)=>{
    try{
        const result=await query('SELECT * FROM subjects');
        if(result.length===0){
            return res.status(404).json({message:"No sunjects found"});
        }
        return res.status(200).json({message:"Subjects retrieved successfully",subjects:result});
    }
    catch(err){
        return res.status(500).json({message:"Server error",error:err.message});
    }
}

// Public: Get all announcements (for students/faculty/public)
exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await query(
            `SELECT announcement_id, title, description, type, file_url, admin_id, created_at
             FROM announcement
             ORDER BY created_at DESC`
        );
        if (!announcements || announcements.length === 0) {
            return res.status(200).json({ message: "No announcements found", announcements: [] });
        }

        // If BACKEND_BASE_URL provided, ensure file urls are absolute (cloudinary usually returns absolute URLs)

        const normalized = announcements.map(a => ({
            id: a.announcement_id,
            title: a.title,
            description: a.description,
            type: a.type,
            file_url: a.file_url ? a.file_url : null,
            admin_id: a.admin_id,
            created_at: a.created_at
        }));

        return res.status(200).json({ message: "Announcements retrieved successfully", announcements: normalized });
    } catch (err) {
        console.error('Error fetching announcements:', err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};