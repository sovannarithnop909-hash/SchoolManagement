const express = require('express');
const { getStudentReports, getAttendanceReports, getGradeReports, getFeeReports } = require('../controllers/reportController');
const { authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/students', authorizeRoles('ADMIN', 'ACCOUNTANT'), getStudentReports);
router.get('/attendance', authorizeRoles('ADMIN', 'TEACHER'), getAttendanceReports);
router.get('/grades', authorizeRoles('ADMIN', 'TEACHER'), getGradeReports);
router.get('/fees', authorizeRoles('ADMIN', 'ACCOUNTANT'), getFeeReports);

module.exports = router;
