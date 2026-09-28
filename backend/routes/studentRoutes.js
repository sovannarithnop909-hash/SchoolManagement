const express = require('express');
const {
    getStudents,
    getStudentById,
    getStudentByUserId,
    createStudent,
    updateStudent,
    deleteStudent,
} = require('../controllers/studentController');
const { authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authorizeRoles('ADMIN', 'TEACHER', 'ACCOUNTANT'), getStudents);
router.get('/me', authorizeRoles('STUDENT'), getStudentByUserId);
router.get('/:id', authorizeRoles('ADMIN', 'TEACHER', 'ACCOUNTANT'), getStudentById);
router.post('/', authorizeRoles('ADMIN', 'TEACHER'), createStudent);
router.put('/:id', authorizeRoles('ADMIN', 'TEACHER'), updateStudent);
router.delete('/:id', authorizeRoles('ADMIN'), deleteStudent);

module.exports = router;
