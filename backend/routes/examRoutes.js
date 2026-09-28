const express = require('express');
const { listExams, createExam } = require('../controllers/examController');
const { authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authorizeRoles('ADMIN', 'TEACHER'), listExams);
router.post('/', authorizeRoles('ADMIN', 'TEACHER'), createExam);

module.exports = router;
