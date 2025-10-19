const express=require("express");
const router=express.Router();
const facultyController=require('../controllers/faculty.controllers');



router.post('/login', facultyController.loginFaculty);
router.post('/reset-password',facultyController.resetPassword);
router.get('/get-faculty',facultyController.getFaculty);

router.get('/assigned-subjects/:faculty_id',facultyController.getAssignedSubjects);

router.get('/get-section/:faculty_id',facultyController.getSections);

router.get('/get-student/:section_id',facultyController.getStudentOfSection);

router.post('/mark-attendance',facultyController.markAttendance);

router.get('/get-announcement',facultyController.getAnnouncement);

module.exports = router;