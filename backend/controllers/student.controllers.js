const connDB = require('../db/db.conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
require('dotenv').config();

const query = util.promisify(connDB.query).bind(connDB);

exports.loginStudent = async (req, res) => {
    const {email ,password}=req.body;
    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    try{
        const result= await query("SELECT * from student where email=?",[email]);
        if(result.length===0){
            return res.status(404).json({message:"Student not found"});
        }
        const isMatch=await bcrypt.compare(password,result[0].password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid credentials"});
        }
        const studentData = {id:result[0].student_id,email:result[0].email,name:result[0].name};
        const token=jwt.sign(
            studentData,
            process.env.JWT_SECRET_KEY,
            {expiresIn:'1h'}
        );
        
        // Save the token to the student's record in the database
        await query("UPDATE student SET token = ? WHERE student_id = ?", [token, result[0].student_id]);

        return res.status(200).json({
            message:"Login successful",
            token,
            role:"student",
        });
    }
    catch(err){
        console.error("Student login error:", err);
        return res.status(500).json({message:"Server error",error:err.message});
    }
}
exports.resetPassword = async (req, res) => {
    const { student_id, oldPassword, newPassword } = req.body;

    if (!newPassword || !oldPassword || !student_id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        
        const result = await query("SELECT * FROM Student WHERE student_id = ?", [student_id]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, result[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect old password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        
        await query("UPDATE Student SET password = ? WHERE student_id = ?", [hashedPassword, student_id]);

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getProfile=async(req,res)=>{
    const studentID=req.params.student_id;
    if(!studentID){
        return res.status(400).json({message:"Required Student ID"});
    }
    try{
        const result=await query('SELECT * FROM Student Where student_id=?',[studentID]);
        if(result.length===0){
            return res.status(404).json({message:"Student not found"});
        }
        return res.status(200).json({result});
    }
    catch(err){
        return res.status(500).json({message:"Server error",error:err.message});
    }
}

exports.currentSubject = async (req, res) => {
    const studentId = req.params.student_id;

    if (!studentId) {
        return res.status(400).json({ message: "Student ID is required" });
    }

    try {
        const [subjects] = await db.query(
            `SELECT subj.subject_id, subj.subject_name, fs.faculty_id, f.name AS faculty_name
             FROM Student s
             JOIN Faculty_Subject fs 
               ON s.course_id = fs.course_id
              AND (s.branch_id IS NULL OR s.branch_id = fs.branch_id)
              AND s.semester = fs.semester
             JOIN Subjects subj ON fs.subject_id = subj.subject_id
             JOIN Faculty f ON fs.faculty_id = f.faculty_id
             WHERE s.student_id = ?`,
            [studentId]
        );

        if (subjects.length === 0) {
            return res.status(404).json({ message: "No subjects found for this student" });
        }

        return res.status(200).json(subjects);
    } catch (err) {
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

exports.getStudentAttendance = async (req, res) => {
    const { student_id } = req.params;

    if (!student_id) {
        return res.status(400).json({ message: "Student ID is required" });
    }

    try {
        const [attendance] = await db.query(
            `SELECT 
                s.subject_id,
                sub.subject_name,
                COUNT(a.attendance_id) AS total_classes,
                SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS total_present,
                SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS total_absent,
                ROUND(SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.attendance_id), 2) AS percentage
            FROM Attendance a
            JOIN Faculty_Subject s ON a.faculty_subject_id = s.id
            JOIN Subject sub ON s.subject_id = sub.subject_id
            WHERE a.student_id = ?
            GROUP BY s.subject_id, sub.subject_name`,
            [student_id]
        );

        if (attendance.length === 0) {
            return res.status(404).json({ message: "No attendance records found" });
        }

        return res.status(200).json(attendance);
    } catch (err) {
        console.error("Error fetching attendance:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
