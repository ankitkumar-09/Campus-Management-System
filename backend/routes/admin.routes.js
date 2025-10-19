const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controllers');
const {upload}=require('../db/multer.conn');



router.post('/login',adminController.adminLogin);
router.post('/validate-token',adminController.validateToken);
router.post('/logout', adminController.adminLogout);
router.get('/profile-by-token',adminController.getProfileWithToken);
router.post('/reset-password',adminController.resetPassword);

//annnouncements..
router.post('/add-announcement',upload.single('announcement_file'),adminController.uploadAnnouncement);
router.put('/update-announcement/:id', upload.single('announcement_file'), adminController.updateAnnouncement);
router.delete('/delete-announcement/:id', adminController.deleteAnnouncement);

//department...
router.post('/add-department',adminController.addDepartment);
router.get('/get-all-departments',adminController.getAllDepartments);
router.get('/get-department/:department_id',adminController.getDepartment);
router.put('/update-department/:id', adminController.updateDepartment);
router.delete('/delete-department/:id', adminController.deleteDepartment);


//adding new course...
router.post('/add-new-course', adminController.addNewCourse);
router.get('/get-all-courses', adminController.getAllCourses);
router.put('/update-course/:course_id', adminController.updateCourse);
router.delete('/delete-course/:id', adminController.deleteCourse);

//adding branch in course...
router.post('/add-branch',adminController.addBranch);
router.get('/get-branches/:course_id', adminController.getAllBranches);
router.put('/update-branch/:branch_id', adminController.updateBranch);
router.delete('/delete-branch/:branch_id', adminController.deleteBranch);

//adding new faculty

router.post('/add-faculty', upload.single('profileImage'), adminController.addFaculty);
router.get('/get-all-faculty', adminController.getAllFaculty);
router.put('/update-faculty/:email', upload.single('profileImage'), adminController.updateFaculty);
router.delete('/delete-faculty/:email', adminController.deleteFaculty);

router.post('/add-student', adminController.addStudent);
router.post('/add-bulk-student',upload.single('file'),adminController.addBulkStudent);
router.get('/students', adminController.getAllStudents);
router.get('/student/:student_id', adminController.getStudentById);
router.put('/student/:student_id', upload.single('profile_image'), adminController.updateStudent);
router.delete('/student/:student_id', adminController.deleteStudent);



//adding new subject...
router.post('/add-new-subject', adminController.addNewSubject);
router.get('/get-all-subjects', adminController.getAllSubjects);
router.get('/get-all-subjects-by-course/:course', adminController.getAllSubjectsByCourse);

//adding section in course....
router.post('/add-section',adminController.addSection);
router.get('/get-all-sections/:course_id',adminController.getAllSections);

//adding students to section...

//adding students to section...
router.post('/add-students-to-section',adminController.addStudentsToSection);









//assigning subject course section wise to faculty...
router.post('/assign-course-section-subject-to-faculty',adminController.assignSubjectToFaculty);

module.exports = router;