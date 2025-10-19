const express=require("express");
const router=express.Router();
const studentController=require('../controllers/student.controllers');

router.post('/login',studentController.loginStudent);
router.post('/reset-password',studentController.resetPassword);

router.get('/profile/:student_id',studentController.getProfile);

router.get('/current-subjects',studentController.currentSubject);
router.get('get-announcement',studentController.getAnnouncement);
router.get('/get-student-attendance',studentController.getStudentAttendance);

module.exports=router;