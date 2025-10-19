const fs = require('fs');
const xlsx = require('xlsx');
const nodemailer = require('nodemailer');
require('dotenv').config();




exports.parseStudentFile = async (filePath) => {
    // Read Excel/CSV file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Delete file after parsing to save space
    fs.unlinkSync(filePath);

    return data.map(row => ({
        name: row.name,
        email: row.email,
        roll_no: row.roll_no,
        course: row.course,
        branch: row.branch,
        semester: row.semester,
        year: row.year,
        dob: row.dob,
        gender: row.gender,
        contact: row.contact,
        address: row.address
    }));
};


exports.sendCredentials = async (email, name, password, role) => {
    console.log("Sending credentials");
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `Graphic Era <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: 'Welcome to Graphic Era – Your Login Credentials',
            text: `Dear ${name},

Welcome to Graphic Era University!
We are excited to have you join our community as a valued ${role}.

Your account has been successfully created. Please find your login credentials below:

Username: ${email}
Password: ${password}

You can access the portal here: [Portal Link]

For Students:
- View timetable, access course materials, check attendance, track exams.
For Faculty:
- Manage classes, share materials, track student progress, access resources.

Important:
Please change your password after your first login and keep your credentials confidential.

If you have questions or need assistance, contact our IT Help Desk at support@geu.ac.in.

Once again, welcome to Graphic Era University – where learning, innovation, and growth come together!

Best regards,
IT & Administrative Services
Graphic Era University`
        };

        try {
            await transporter.sendMail(mailOptions);
            return { success: true, password: password };
        } catch (err) {
            return { success: false, message: "Error sending email! Incorrect email", error: err.message };
        }
    } catch (err) {
        console.error("Error sending email:", err);
        return false;
    }
};

