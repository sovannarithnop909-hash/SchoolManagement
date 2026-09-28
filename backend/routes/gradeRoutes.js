const express = require('express');
const { listGrades, createGrade } = require('../controllers/gradeController');
const { authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', listGrades);
router.post('/', authorizeRoles('ADMIN', 'TEACHER'), createGrade);

module.exports = router;
