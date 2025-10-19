const connDB = require('../db/db.conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
require('dotenv').config();
const cloudinary=require('../db/cloudinary.conn');
const fs=require('fs');
const path = require('path');

const query = util.promisify(connDB.query).bind(connDB);
const adminService = require('../services/admin.services');

// Helper to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    const lastPart = parts.pop();
    const publicIdWithExtension = lastPart.split('.')[0];
    const folder = parts.slice(parts.indexOf('upload') + 2).join('/');
    return folder ? `${folder}/${publicIdWithExtension}` : publicIdWithExtension;
};




exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const result = await query('SELECT * FROM admin WHERE email=?', [email]);
        if (result.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }
        const isMatch = await bcrypt.compare(password, result[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const adminData = { id: result[0].admin_id, email: result[0].email, name: result[0].name };
        const token = jwt.sign(
            adminData,
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        await query('UPDATE admin SET token = ? WHERE admin_id = ?', [token, result[0].admin_id]);

        return res.status(200).json({
            message: "Login successful",
            token,
            role: "admin",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getProfileWithToken = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ 
            success: false, 
            message: "Authentication token is required." 
        });
    }

    try {
        const sql = 'SELECT admin_id, name, email FROM admin WHERE token = ?';
        const results = await query(sql, [token]);
        if (results.length > 0) {
            const adminProfile = results[0];
            return res.status(200).json({
                success: true,
                message: "Admin profile found!",
                admin: adminProfile
            });
        } else {
            return res.status(404).json({ 
                success: false, 
                message: "Admin not found or token is invalid." 
            });
        }
    } catch (error) {
        console.error("Error fetching admin profile by token:", error);
        return res.status(500).json({ 
            success: false, 
            message: "An internal server error occurred." 
        });
    }
};


exports.adminLogout = async (req, res) => {
    const {token} = req.body;

    if (!token) {
        return res.status(401).json({ message: "No token provided." });
    }

    try {
        // Add token to the blocklist
        await query('INSERT INTO blocked_tokens (token) VALUES (?)', [token]);
        // Clear the token from the admin table
        await query('UPDATE admin SET token = NULL WHERE token = ?', [token]);
        res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Server error during logout." });
    }
};
exports.resetPassword = async (req, res) => {
    const { admin_id, oldPassword, newPassword } = req.body;
    if (!newPassword || !oldPassword || !admin_id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        
        const result = await query("SELECT * FROM admin WHERE admin_id = ?", [admin_id]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, result[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect old password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        
        await query("UPDATE admin SET password = ? WHERE admin_id = ?", [hashedPassword, admin_id]);

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.validateToken=async(req,res)=>{
    const { token } = req.body;
    if(!token){
        return res.status(400).json({message:"Token not found!"});
    }
    
    try {
    
        const adminResult = await query('SELECT * FROM admin WHERE token = ?', [token]);
        if (adminResult.length === 0) {
            return res.status(401).json({ message: "Invalid or expired token." });
        }

        const blockedResult = await query('SELECT * FROM blocked_tokens WHERE token = ?', [token]);
        if (blockedResult.length > 0) {
            return res.status(401).json({ message: "Token has been invalidated. Please log in again." });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token verification failed.", error: err.message });
            }
            res.status(200).json({ message: "Token is valid.", user: decoded });
        });

    } catch (error) {
        console.error("Token validation error:", error);
        res.status(500).json({ message: "Server error during token validation." });
    }
};


exports.uploadAnnouncement = async (req, res) => {
    const description = req.body.description ? req.body.description.replace(/[^\x20-\x7E\s]/g, '') : '';
    const {title,type,admin_id} = req.body;
    let fileUrl = null;
    try {
        if (req.file) {
            // Normalize path for all OS
            const filePath = req.file.path.split(path.sep).join(path.posix.sep);
            const result = await cloudinary.uploader.upload(filePath, {
                folder: type || "Others",
                resource_type: 'auto',
                access_mode: "public"
            });
            fs.unlinkSync(req.file.path);
            fileUrl = result.secure_url;
        }
        // Save announcement info in DB
        await query(
            `INSERT INTO announcement (title, description, type, file_url, admin_id, created_at)
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [
                title || '',
                description || '',
                type || 'Others',
                fileUrl,
                admin_id
            ]
        );

        res.status(201).json({
            message: "Announcement saved successfully",
            url: fileUrl
        });

    } catch (err) {
        res.status(500).json({
            message: "Uploading failed.",
            error: err.message
        });
    }
}

exports.updateAnnouncement = async (req, res) => {
    const { id } = req.params;
    const { title, description, type } = req.body;
    //make it who uploaded only that person can edit...
    console.log(id,title);
    let fileUrl = null;

    try {
        const existing = await query('SELECT file_url FROM announcement WHERE announcement_id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: "Announcement not found." });
        }
        const oldFileUrl = existing[0].file_url;

        if (req.file) {
            // Upload new file to Cloudinary
            const filePath = req.file.path.split(path.sep).join(path.posix.sep);
            const result = await cloudinary.uploader.upload(filePath, {
                folder: type || "Others",
                resource_type: 'auto',
                access_mode: "public"
            });
            fs.unlinkSync(req.file.path); // Delete local temp file
            fileUrl = result.secure_url;

            // If there was an old file, delete it from Cloudinary
            if (oldFileUrl) {
                const publicId = getPublicIdFromUrl(oldFileUrl);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            }
        }

        const sql = `
            UPDATE announcement
            SET title = ?, description = ?, type = ?
            ${fileUrl ? ', file_url = ?' : ''}
            WHERE announcement_id = ?
        `;
        const params = fileUrl ? [title, description, type, fileUrl, id] : [title, description, type, id];

        await query(sql, params);

        res.status(200).json({ message: "Announcement updated successfully." });

    } catch (err) {
        console.error("Update failed:", err);
        res.status(500).json({ message: "Update failed.", error: err.message });
    }
};

exports.deleteAnnouncement = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await query('SELECT file_url FROM announcement WHERE announcement_id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: "Announcement not found." });
        }
        const fileUrl = results[0].file_url;

        if (fileUrl) {
            const publicId = getPublicIdFromUrl(fileUrl);
            if(publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        await query('DELETE FROM announcement WHERE announcement_id = ?', [id]);

        res.status(200).json({ message: "Announcement deleted successfully." });
    } catch (err) {
        console.error("Delete failed:", err);
        res.status(500).json({ message: "Delete failed.", error: err.message });
    }
};

exports.addDepartment= async(req,res)=>{
    const{ department_name,dept_code,hod_name,hod_email,phone,office_location,description} = req.body;
    if(!department_name || !dept_code ){
        return res.status(400).json({message:"Department name and code are required"});
    }
    try{
        const existing=await query('SELECT * FROM Departments WHERE dept_code=?',[dept_code]);
        if(existing.length>0){
            return res.status(409).json({message:"Department with this code already exists"});
        }
        await query(
            `INSERT INTO Departments (department_name, dept_code, hod_name, hod_email, phone, office_location, description)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [department_name, dept_code, hod_name || null, hod_email || null, phone || null, office_location || null, description || null]
        );
        res.status(201).json({message:"Department added successfully"});
    }
    catch(err){
        return res.status(500).json({message:"server error",error:err.message});
    }
}
exports.updateDepartment = async (req, res) => {
    const { id } = req.params;
    const { department_name, dept_code, hod_name, hod_email, phone, office_location, description } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Department ID is required" });
    }

    try {
        const existing = await query("SELECT * FROM Departments WHERE department_id = ?", [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: "Department not found" });
        }

        // Prevent duplicate dept_code (if changed)
        if (dept_code) {
            const duplicate = await query("SELECT * FROM Departments WHERE dept_code = ? AND department_id != ?", [dept_code, id]);
            if (duplicate.length > 0) {
                return res.status(409).json({ message: "Another department with this code already exists" });
            }
        }

        await query(
            `UPDATE Departments 
             SET department_name = ?, 
                 dept_code = ?, 
                 hod_name = ?, 
                 hod_email = ?, 
                 phone = ?, 
                 office_location = ?, 
                 description = ?
             WHERE department_id = ?`,
            [department_name, dept_code, hod_name, hod_email, phone, office_location, description, id]
        );

        return res.status(200).json({ message: "Department updated successfully" });
    } 
    catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
exports.deleteDepartment = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Department ID is required" });
    }

    try {
        const existing = await query("SELECT * FROM Departments WHERE department_id = ?", [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: "Department not found" });
        }

        await query("DELETE FROM Departments WHERE department_id = ?", [id]);

        return res.status(200).json({ message: "Department deleted successfully" });
    } 
    catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
exports.getDepartment = async (req, res) => {
    const { department_id } = req.params;
    console.log("Hitting");
    try {
        const department = await query('SELECT * FROM Departments WHERE department_id = ?', [department_id]);

        if (department.length === 0) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.status(200).json(department[0]);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
exports.getAllDepartments=async(req,res)=>{
    try{
        const departments=await query("SELECT * FROM Departments");
        if(departments.length==0){
            return res.status(404).json({message:"No departments found"});
        }
        return res.status(200).json(departments);
    }
    catch(err){
        return res.status(500).json({message:"Server error",error:err.message});
    }
}

// Add new course
exports.addNewCourse = async (req, res) => {
    const { course_name, course_code, department, duration_years, total_semesters, branches } = req.body

    try {
        //Insert course details first...
        const courseResult = await query(
            'INSERT INTO Courses (course_name, course_code, department, duration_years, total_semesters) VALUES (?, ?, ?, ?, ?)',
            [course_name, course_code, department, duration_years, total_semesters]
        );

        //Get the ID of the course you just created.
        const newCourseId = courseResult.insertId;

        //If there are branches, loop through and insert them using the new course ID.
        if (branches && branches.length > 0) {
            for (const branch of branches) {
                await query(
                    'INSERT INTO Course_Branch (branch_name, description, course_id) VALUES (?, ?, ?)',
                    [branch.branch_name, branch.description || null, newCourseId]
                );
            }
        }
        
        // If everything was successful, commit the transaction.
        // await connection.commit();
        res.status(201).json({ message: "Course and branches added successfully", courseId: newCourseId });

    } catch (err) {
        // If anything fails, roll back all changes.
        // await connection.rollback();
        console.error("Error adding new course:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    } finally {
        // Release the database connection.
        // if (connection) connection.release();
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await query('SELECT * FROM Courses');
        if (courses.length === 0) {
            return res.status(404).json({ message: "No courses found" });
        }
        res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.updateCourse = async (req, res) => {
    const { course_id } = req.params;
    const { course_name, course_code, department, duration_years, total_semesters, branches } = req.body;

    try {
        await query(
            'UPDATE Courses SET course_name=?, course_code=?, department=?, duration_years=?, total_semesters=? WHERE course_id=?',
            [course_name, course_code, department, duration_years, total_semesters, course_id]
        );
        const existingBranches = await query('SELECT branch_id FROM Course_Branch WHERE course_id = ?', [course_id]);
        const existingBranchIds = existingBranches.map(b => b.branch_id);

        const incomingBranchIds = branches.map(b => b.branch_id).filter(id => id);

        // Branches that exist in the DB but not in the submitted form data.
        const branchesToDelete = existingBranchIds.filter(id => !incomingBranchIds.includes(id));
        if (branchesToDelete.length > 0) {
            await query('DELETE FROM Course_Branch WHERE branch_id IN (?)', [branchesToDelete]);
        }

        //UPDATE existing branches and INSERT new ones.
        for (const branch of branches) {
            if (branch.branch_id) {
                await query(
                    'UPDATE Course_Branch SET branch_name = ?, description = ? WHERE branch_id = ?',
                    [branch.branch_name, branch.description || null, branch.branch_id]
                );
            } else {
                await query(
                    'INSERT INTO Course_Branch (branch_name, description, course_id) VALUES (?, ?, ?)',
                    [branch.branch_name, branch.description || null, course_id]
                );
            }
        }
        
        // If all queries were successful:
        // await connection.commit();
        res.status(200).json({ message: "Course updated successfully" });

    } catch (err) {
        // If any query fails, roll back all changes.
        // await connection.rollback();
        console.error("Error updating course:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    } finally {
        // Release the connection back to the pool.
        // if (connection) connection.release();
    }
};

exports.deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const existing = await query('SELECT * FROM Courses WHERE course_id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        await query('DELETE FROM Courses WHERE course_id = ?', [id]);

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.addBranch=async(req,res)=>{
    const {branch_name,course_id,description}=req.body;
    if(!branch_name ||!course_id){
        return res.status(400).json({message:"Branch name and course ID are required"});
    }
    try{
        const existing =await query('SELECT * FROM Course_Branch WHERE branch_name=? AND course_id=?',[branch_name, course_id]);
        if(existing.length>0){
            return res.status(499).json({ message: "Branch already exists for this course" });
        }
        await query('INSERT INTO Course_Branch (branch_name, course_id, description) VALUES (?, ?, ?)',
            [branch_name, course_id, description || null]
        );
        res.status(201).json({ message: "Branch added successfully" });
    }
    catch(err){
        console.error("Error adding branch:",err);
        return res.status(500).json({message:"Server error",error:err.message});
    }
};
exports.getAllBranches=async(req,res)=>{
    const {course_id}=req.params;
    try{
        const branches= await query('Select * from Course_Branch where course_id=?',[course_id]);
        if(branches.length===0){
            return res.status(404).json({message:"No branches found"});
        }
        res.status(200).json(branches);
    }
    catch(err){
        return res.status(500).json({message:"Server Error",error:err.message});
    }
}
exports.updateBranch = async (req, res) => {
    const { branch_id } = req.params;
    const { branch_name, description } = req.body;

    if (!branch_name) {
        return res.status(400).json({ message: "Branch name is required" });
    }

    try {
        const result = await query(
            'UPDATE Course_Branch SET branch_name = ?, description = ? WHERE branch_id = ?',
            [branch_name, description || null, branch_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Branch not found" });
        }

        res.status(200).json({ message: "Branch updated successfully" });
    } catch (err) {
        console.error("Error updating branch:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
exports.deleteBranch = async (req, res) => {
    const { branch_id } = req.params;

    try {
        const result = await query('DELETE FROM Course_Branch WHERE branch_id = ?', [branch_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Branch not found" });
        }

        res.status(200).json({ message: "Branch deleted successfully" });
    } catch (err) {
        console.error("Error deleting branch:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

function generateRandomPassword(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}
//adding faculty...
exports.addFaculty = async (req, res) => {
    const { name, department_id, email, dob, contact_number, address, gender, designation, degree } = req.body;
    if (!name || !email || !department_id) {
        return res.status(400).json({ message: "Name, email, and department are required" });
    }

    let profileImageUrl = null;

    try {
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "faculty_profiles",
                resource_type: 'auto'
            });
            fs.unlinkSync(req.file.path);
            profileImageUrl = result.secure_url;
        }
        const existing = await query('SELECT * FROM Faculty WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Faculty with this email already exists" });
        }
        const password = generateRandomPassword(8);
        const mailSendDetails = await adminService.sendCredentials(email, name, password, "Faculty Member");
        if (!mailSendDetails.success) {
            return res.status(500).json({ message: "Error sending email", error: mailSendDetails.error });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        
        await query(
            `INSERT INTO Faculty (name, department_id, email, password, dob, contact_number, address, gender, designation, degree, profile_image_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, department_id, email, hashedPassword, dob, contact_number, address, gender, designation, degree, profileImageUrl]
        );

        res.status(201).json({ message: "Faculty added successfully" });

    } catch (error) {
        console.error("Error adding faculty:", error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: "Server error during faculty creation." });
    }
};
exports.updateFaculty = async (req, res) => {
    const { email } = req.params;
    const { name, department_id, dob, contact_number, address, gender, designation, degree } = req.body;

    if (!name || !department_id) {
        return res.status(400).json({ message: "Name and department are required" });
    }

    try {
        const existing = await query('SELECT * FROM Faculty WHERE email = ?', [email]);
        if (existing.length === 0) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        let finalProfileImageUrl = existing[0].profile_image_url;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "faculty_profiles",
                resource_type: 'auto'
            });
            fs.unlinkSync(req.file.path);
            finalProfileImageUrl = result.secure_url;
            
        }

        await query(
            `UPDATE Faculty 
             SET name = ?, department_id = ?, dob = ?, contact_number = ?, address = ?, gender = ?, designation = ?, degree = ?, profile_image_url = ?
             WHERE email = ?`,
            [name, department_id, dob, contact_number, address, gender, designation, degree, finalProfileImageUrl, email]
        );

        res.status(200).json({ message: "Faculty updated successfully" });

    } catch (error) {
        console.error("Error updating faculty:", error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: "Server error" });
    }
};
exports.getAllFaculty = async (req, res) => {
    try {
        const allFaculty = await query('SELECT faculty_id, name, department_id, email, dob, contact_number, address, gender, designation, degree, profile_image_url FROM Faculty');
        res.status(200).json(allFaculty);
    } catch (error) {
        console.error("Error fetching faculty:", error);
        res.status(500).json({ message: "Server error while fetching faculty" });
    }
};
exports.deleteFaculty = async (req, res) => {
    const { email } = req.params;
    try {
        const existing = await query('SELECT * FROM Faculty WHERE email = ?', [email]);
        if (existing.length === 0) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        await query('DELETE FROM Faculty WHERE email = ?', [email]);
        res.status(200).json({ message: "Faculty deleted successfully" });
    } catch (error) {
        console.error("Error deleting faculty:", error);
        res.status(500).json({ message: "Server error" });
    }
};


//adding students...
exports.addStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            course_id,
            branch_id,
            section_id,
            department_id,
            semester,
            year,
            dob,
            gender,
            nationality,
            blood_group,
            contact,
            address,
            father_name,
            father_contact,
            father_occupation,
            mother_name,
            mother_contact,
            mother_occupation
        } = req.body;

        const lastStudent = await query("SELECT MAX(university_id) AS maxUniId FROM Student");
        let university_id = "10001";
        if (lastStudent[0].maxUniId) {
            university_id = (parseInt(lastStudent[0].maxUniId) + 1).toString().padStart(5, "0");
        }
        
        const lastRoll = await query("SELECT MAX(roll_no) AS maxRoll FROM Student");
        let newRollNo = "20001";
        if (lastRoll[0].maxRoll) {
            newRollNo = (parseInt(lastRoll[0].maxRoll) + 1).toString().padStart(5, "0");
        }

        const password = generateRandomPassword();
        const mailSendDetails = await adminService.sendCredentials(email, name, password, "Student");
        if (!mailSendDetails.success) {
            return res.status(500).json({
                success: false,
                message: "Error sending email",
                error: mailSendDetails.error
            });
        }
        const hashedPassword = await bcrypt.hash(mailSendDetails.password, 10);
        
        const result = await query(
            `INSERT INTO Student (
                university_id, name, email, password, roll_no,
                course_id, branch_id, section_id, department_id,
                semester, year, dob, gender,
                nationality, blood_group, contact, address,
                father_name, father_contact, father_occupation,
                mother_name, mother_contact, mother_occupation
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                university_id, name, email, hashedPassword, newRollNo,
                course_id, branch_id || null, section_id || null, department_id,
                semester, year, dob, gender,
                nationality, blood_group, contact, address,
                father_name, father_contact, father_occupation,
                mother_name, mother_contact, mother_occupation
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(500).json({ success: false, message: "Error adding student" });
        }

        return res.status(201).json({
            success: true,
            message: "Student added successfully",
            data: {
                student_id: result.insertId,
                university_id,
                roll_no: newRollNo
            }
        });

    } catch (err) {
        console.error(err);
        if (err.code === 'ER_NO_DEFAULT_FOR_FIELD') {
             return res.status(400).json({
                success: false,
                message: "Database error: 'department_id' is a required field and was not provided.",
                error: err.message
            });
        }
        res.status(500).json({
            success: false,
            message: "Error adding student",
            error: err.message
        });
    }
};

exports.addBulkStudent = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File is required" });
        }
        
        const students = await adminService.parseStudentFile(req.file.path);

        const requiredFields = [
            'name', 'email', 'course_id', 'department_id',
            'semester', 'year', 'dob', 'gender', 'contact', 'address'
        ];

        for (const student of students) {
            for (const field of requiredFields) {
                if (!student[field]) {
                    return res.status(400).json({
                        message: `Missing required field '${field}' in the record for email: ${student.email || 'N/A'}`
                    });
                }
            }
        }
        
        const values = [];
        let failedEmails = [];

        const [lastIds] = await query(`
            SELECT 
                COALESCE(MAX(CAST(roll_no AS UNSIGNED)), 20000) AS last_roll,
                COALESCE(MAX(CAST(university_id AS UNSIGNED)), 10000) AS last_univ
            FROM Student
        `);

        let rollCounter = lastIds.last_roll;
        let univCounter = lastIds.last_univ;

        for (const s of students) {
            const password = generateRandomPassword();
            const mailSendDetails = await adminService.sendCredentials(s.email, s.name, password, "Student");
            if (!mailSendDetails.success) {
                failedEmails.push({ email: s.email, error: mailSendDetails.error });
                continue;
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            
            rollCounter++;
            univCounter++;
            const roll_no = String(rollCounter).padStart(5, '0');
            const university_id = String(univCounter).padStart(5, '0');

            values.push([
                university_id,
                s.name,
                s.email,
                hashedPassword,
                roll_no,
                s.course_id,
                s.branch_id || null,
                s.section_id || null,
                s.department_id,
                s.semester,
                s.year,
                s.dob,
                s.gender,
                s.nationality || 'Indian',
                s.blood_group || null,
                s.contact,
                s.address,
                s.father_name || null,
                s.father_contact || null,
                s.father_occupation || null,
                s.mother_name || null,
                s.mother_contact || null,
                s.mother_occupation || null
            ]);
        }

        if (values.length === 0) {
            return res.status(500).json({
                message: "No students to add. All email attempts may have failed.",
                failedEmails
            });
        }

        const sql = `
            INSERT INTO Student
            (university_id, name, email, password, roll_no,
             course_id, branch_id, section_id, department_id,
             semester, year, dob, gender,
             nationality, blood_group, contact, address,
             father_name, father_contact, father_occupation,
             mother_name, mother_contact, mother_occupation)
            VALUES ?
        `;

        await query(sql, [values]);

        res.status(201).json({
            message: "Bulk students added successfully",
            added: values.length,
            failedEmails
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An unexpected error occurred during the bulk upload.", error: error.message });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const { course_id } = req.query;

        let sql = `
            SELECT
                s.student_id, s.university_id, s.name, s.email, s.roll_no,
                s.contact, s.year, s.semester, c.course_name, cb.branch_name
            FROM Student s
            LEFT JOIN Courses c ON s.course_id = c.course_id
            LEFT JOIN Course_Branch cb ON s.branch_id = cb.branch_id
        `;
        const params = [];

        if (course_id) {
            sql += " WHERE s.course_id = ?";
            params.push(course_id);
        }

        sql += " ORDER BY s.name ASC";

        const students = await query(sql, params);

        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });

    } catch (err) {
        console.error("Error fetching students:", err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const { student_id } = req.params;

        const sql = `
            SELECT 
                s.*, 
                c.course_name,
                cb.branch_name,
                sec.section_name,
                d.department_name
            FROM Student s
            LEFT JOIN Courses c ON s.course_id = c.course_id
            LEFT JOIN Course_Branch cb ON s.branch_id = cb.branch_id
            LEFT JOIN Sections sec ON s.section_id = sec.section_id
            LEFT JOIN Departments d ON s.department_id = d.department_id
            WHERE s.student_id = ?
        `;
        
        const [student] = await query(sql, [student_id]);

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        
        delete student.password; 

        res.status(200).json({ success: true, data: student });

    } catch (err) {
        console.error("Error fetching student:", err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

exports.updateStudent = async (req, res) => {
    const { student_id } = req.params;

    try {
        const [existingStudent] = await query("SELECT profile_image_url FROM Student WHERE student_id = ?", [student_id]);

        if (!existingStudent) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        let newImageUrl = null;
        if (req.file) {
            if (existingStudent.profile_image_url) {
                const publicId = getPublicIdFromUrl(existingStudent.profile_image_url);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            }
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'student-profiles',
                resource_type: 'image'
            });
            newImageUrl = result.secure_url;
            fs.unlinkSync(req.file.path);
        }
        
        const updateData = { ...req.body };
        if (newImageUrl) {
            updateData.profile_image_url = newImageUrl;
        }

        delete updateData.student_id;
        delete updateData.university_id;
        delete updateData.roll_no;
        delete updateData.email;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: "No fields provided for update." });
        }

        const result = await query("UPDATE Student SET ? WHERE student_id = ?", [updateData, student_id]);

        if (result.affectedRows === 0) {
             return res.status(404).json({ success: false, message: "Student not found or data was unchanged." });
        }

        res.status(200).json({ success: true, message: "Student updated successfully." });

    } catch (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error("Error updating student:", err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const { student_id } = req.params;

        const [student] = await query("SELECT profile_image_url FROM Student WHERE student_id = ?", [student_id]);

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        if (student.profile_image_url) {
            const publicId = getPublicIdFromUrl(student.profile_image_url);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        const result = await query("DELETE FROM Student WHERE student_id = ?", [student_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Student could not be deleted' });
        }

        res.status(200).json({ success: true, message: 'Student deleted successfully ✅' });

    } catch (err) {
        console.error("Error deleting student:", err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};


exports.addNewSubject=async(req,res)=>{
    const {subject_name,subject_code,course,credits,description}=req.body;
    try{
        if(!subject_name || !subject_code ||!course || !credits){
            return res.status(400).json({ message: "Subject name, code, and credits are required" });
        }
        const existing = await query('SELECT * FROM Subjects WHERE subject_code = ?', [subject_code]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Subject with this code already exists" });
        }
        await query(
            `INSERT INTO Subjects (subject_name, subject_code,course, credits, description)
             VALUES (?, ?, ?, ?, ?)`,
            [subject_name, subject_code,course, credits, description || null]
        );

        res.status(201).json({ message: "Subject added successfully" });
    }
    catch(error){
        console.error("Error adding subject:", error);
        res.status(500).json({ message: "Server error" });
    }
}

exports.getAllSubjects=async(req,res)=>{
    try{
        const subjects=await query('SELECT * FROM Subjects');
        if(subjects.length===0){
            return res.status(404).json("No subjects found");
        }
        res.status(200).json(subjects);
    }
    catch(error){
        return res.status(500).json({message:"server error",error:error.message});
    }
}

exports.getAllSubjectsByCourse=async(req,res)=>{
    const course = req.params.course;
    if (!course) {
        return res.status(400).json({ message: "Course Name is required" });
    }
    try {
        const subjects = await query(
            `SELECT * FROM Subjects WHERE course= ?`,
            [course]
        );
        if (subjects.length === 0) {
            return res.status(404).json({ message: "No subjects found for this course" });
        }
        res.status(200).json(subjects);
    } catch (error) {
        console.error("Error fetching subjects by course:", error);
        res.status(500).json({ message: "Server error" });
    }
}

exports.addSection=async(req,res)=>{
    const {section_name,course_id,semster,branch_id}=req.body;
    if(!section_name || !course_id || !semster){
        return res.status(400).json({ message: "Section name, course ID, and semester are required" });
    }
    try {
        const existing = await query('SELECT * FROM Sections WHERE section_name = ? AND course_id = ? AND semester = ?', [section_name, course_id, semster]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Section already exists for this course and semester" });
        }
        await query(
            `INSERT INTO Sections (section_name, course_id, semester,branch_id) VALUES (?, ?, ?, ?)`,
            [section_name, course_id, semster,branch_id || null]
        );

        res.status(201).json({ message: "Section added successfully" });
    } catch (error) {
        console.error("Error adding section:", error);
        res.status(500).json({ message: "Server error" });
    }
}

exports.getAllSections=async(req,res)=>{
    const {course_id}=req.params;
    if(!course_id){
        return res.status(400).json({message:"Course ID is required"});
    }
    try{
        const results=await query('SELECT * FROM sections WHERE course_id=?',[course_id]);
        if(results.length===0){
            return res.status(404).json({message:"No sections found"});
        }
        return res.status(200).json(results);
    }
    catch(err){
        return res.status(500).json({message:"Server error",error:err.message});
    }
}

exports.addStudentsToSection = async (req, res) => {
    const { course_id, branch_id, semester, section_id, student_ids } = req.body;

    if (!course_id || !branch_id || !section_id || !semester || !Array.isArray(student_ids) || student_ids.length === 0) {
        return res.status(400).json({ message: "Course ID, branch ID, semester, section ID, and student IDs array are required" });
    }

    try {
        const section = await query('SELECT * FROM Sections WHERE section_id = ?', [section_id]);
        if (section.length === 0) {
            return res.status(404).json({ message: "Section not found" });
        }

        const students = await query('SELECT * FROM Student WHERE student_id IN (?)', [student_ids]);
        if (students.length !== student_ids.length) {
            return res.status(404).json({ message: "Some students not found" });
        }

        
        await query(
            `UPDATE Student
             SET section_id = ?, semester = ?, course_id = ?, branch_id = ? 
             WHERE student_id IN (?)`,
            [section_id, semester, course_id, branch_id, student_ids]
        );

        res.status(200).json({ message: "Students updated with section successfully" });

    } catch (error) {
        console.error("Error updating students section:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAllFaculty=async(req,res)=>{
    try{

        const faculties=await query('SELECT * FROM faculty');
        if(faculties.length===0){
            return res.status(404).json({ message: "No faculty found" });
        }
        res.status(200).json(faculties);
    }
    catch(error){
        console.error("Error fetching faculty:", error);
        return res.status(500).json({ message: "Server error", error: error.message }
        );
    }
}

exports.assignSubjectToFaculty=async(req,res)=>{
    const {faculty_id, subject_id, course_id, branch_id, section_id, semester} = req.body;
    if (!faculty_id || !subject_id || !course_id || !semester) {
        return res.status(400).json({ message: "Faculty ID, subject ID, course ID, and semester are required" });
    }
    try {
        const faculty = await query('SELECT * FROM Faculty WHERE faculty_id = ?', [faculty_id]);
        if(faculty.length===0){
            return res.status(404).json({message:"Faculty not found"});
        }
        const subject = await query('SELECT * FROM Subjects WHERE subject_id = ?', [subject_id]);
        if(subject.length===0){
            return res.status(404).json({message:"Subject not found"});
        }
        const existing = await query('SELECT * FROM Faculty_Subject WHERE faculty_id = ? AND subject_id = ?', [faculty_id, subject_id]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Subject already assigned to this faculty" });
        }
        
        await query(
            `INSERT INTO Faculty_Subject (faculty_id, subject_id, course_id, branch_id, section_id, semester)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [faculty_id, subject_id, course_id, branch_id || null, section_id || null, semester]
        );

        return res.status(201).json({ message: "Subject assigned to faculty successfully" });
    }
    catch(error){
        return res.status(500).json({message:"Server error",error:error.message});
    }
}
