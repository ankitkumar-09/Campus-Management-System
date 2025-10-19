const express=require("express");
const router=express.Router();

const allUsersController=require('../controllers/allUsers.controllers');

router.get('/get-subjects',allUsersController.getAllSubject);

// Public announcements endpoint
router.get('/get-announcements', allUsersController.getAllAnnouncements);

module.exports = router;