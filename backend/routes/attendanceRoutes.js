const express = require('express');
const {
    listAttendance,
    createAttendance,
    getAttendanceQrToken,
    markAttendanceFromQr,
    listOwnAttendance,
} = require('../controllers/attendanceController');
const { authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authorizeRoles('ADMIN', 'TEACHER'), listAttendance);
router.get('/me', authorizeRoles('STUDENT'), listOwnAttendance);
router.get('/qr-token', authorizeRoles('ADMIN', 'TEACHER', 'STUDENT'), getAttendanceQrToken);
router.post('/scan', authorizeRoles('ADMIN', 'TEACHER'), markAttendanceFromQr);
router.post('/', authorizeRoles('ADMIN', 'TEACHER'), createAttendance);

module.exports = router;
