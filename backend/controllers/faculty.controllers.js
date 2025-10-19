const connDB = require('../db/db.conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
require('dotenv').config();

const query = util.promisify(connDB.query).bind(connDB);

exports.loginFaculty = async (req, res) => {
    const {email ,password}=req.body;
    console.log(req.body);
    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    try{
        const result= await query("SELECT * from faculty where email=?",[email]);
        if(result.length===0){
            return res.status(404).json({message:"Faculty not found"});
        }
        const isMatch=await bcrypt.compare(password,result[0].password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid credentials"});
        }
        const token=jwt.sign(
            {id:result[0].faculty_id,email:result[0].email,name:result[0].name},
            process.env.JWT_SECRET_KEY,
            {expiresIn:'1h'}
        );
        return res.status(200).json({
            message:"Login successful",
            token,
            role:"faculty",
        });
    }
    catch(err){
        return res.status(500).json({message:"Server error",error:err.message});
    }
}
exports.resetPassword = async (req, res) => {
    const { faculty_id, oldPassword, newPassword } = req.body;

    if (!newPassword || !oldPassword || !faculty_id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        
        const result = await query("SELECT * FROM Faculty WHERE faculty_id = ?", [faculty_id]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, result[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect old password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        
        await query("UPDATE Faculty SET password = ? WHERE faculty_id = ?", [hashedPassword, faculty_id]);

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};


exports.getFaculty=async(req,res)=>{
    try{
        const result=await query('Select * from faculty');
        if(result.length===0){
            return res.status(404).json({message:"No faculty found"});
        }
        return res.status(200).json({
            message:"Faculty retrieved successfully",
            faculty:result
        });
    }
    catch(err){
        return res.status(500).json({message:"Server error",error:err.message});
    }
}

exports.getAssignedSubjects=async(req,res)=>{
    const facultyId= req.params.faculty_id;
    if(!facultyId){
        return res.status(400).json({message:"Faculty ID is required"});
    }
    try{
        const result =await query('SELECT * FROM Faculty_Subject Where faculty_id=?',[facultyId]);
        if(result.length===0){
            return res.status(404).json({message:"No subjects assigned to this faculty"});
        }
        return res.status(200).json({
            message:"Assigned subjects retrieved successfully",
            subjects:result
        });
    }
    catch(err){
        return res.status(500).json({message:"Server error",error:err.message});
    }
}

exports.getSections = async (req, res) => {
    const facultyId = req.params.faculty_id;

    if (!facultyId) {
        return res.status(400).json({ message: "Faculty ID is required" });
    }

    try {
        const [sections] = await db.query(
            `SELECT s.section_id, s.section_name, s.course_id, s.branch_id, s.semester
             FROM Faculty_Subject fs
             JOIN Sections s ON fs.section_id = s.section_id
             WHERE fs.faculty_id = ?`,
            [facultyId]
        );

        if (sections.length === 0) {
            return res.status(404).json({ message: "No sections found for this faculty" });
        }

        return res.status(200).json(sections);
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getStudentOfSection=async(req,res)=>{
    const sectionId=req.params.section_id;
    if(!sectionId){
        return res.status(400).json({message:"Section ID required"});
    }
    try{
        const students=await query('SELECT * from student where section_id=?',[sectionID]);
        if(students.length()===0){
            return res.status(404).json({message:"No students in this section found"});
        }
        return res.status(200).json({message:"Student list fetch successfully",students});
    }
    catch(err){
        return res.status(500).json({message:"Server error",error:err.message});
    }
}


// Mark Attendance
exports.markAttendance = async (req, res) => {
    const { faculty_subject_id, date, attendance } = req.body;
    // attendance = array of { student_id, status }

    if (!faculty_subject_id || !date || !attendance || !Array.isArray(attendance)) {
        return res.status(400).json({ message: "faculty_subject_id, date, and attendance array are required" });
    }

    try {
        for (const record of attendance) {
            const { student_id, status } = record;

            if (!student_id || !status) {
                continue; // skip invalid record
            }

            await db.query(
                `INSERT INTO Attendance (student_id, faculty_subject_id, date, status)
                 VALUES (?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE status = VALUES(status)`,
                [student_id, faculty_subject_id, date, status]
            );
        }

        return res.status(200).json({ message: "Attendance marked successfully" });
    } catch (err) {
        console.error("Error marking attendance:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
exports.getAnnouncement = async (req, res) => {
    try {
        const [announcements] = await db.query(
            "SELECT * FROM Announcement ORDER BY created_at DESC"
        );

        if (announcements.length === 0) {
            return res.status(404).json({ message: "No announcements found" });
        }

        return res.status(200).json(announcements);
    } catch (err) {
        console.error("Error fetching announcements:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};