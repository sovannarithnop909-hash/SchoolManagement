const express = require('express');
const {
    listTeachers,
    getTeacherByUserId,
    createTeacher,
    updateTeacher,
    deleteTeacher,
} = require('../controllers/teacherController');
const { authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authorizeRoles('ADMIN', 'TEACHER'), listTeachers);
router.get('/me', authorizeRoles('TEACHER'), getTeacherByUserId);
router.post('/', authorizeRoles('ADMIN'), createTeacher);
router.put('/:id', authorizeRoles('ADMIN'), updateTeacher);
router.delete('/:id', authorizeRoles('ADMIN'), deleteTeacher);

module.exports = router;
