const express = require('express');
const { listSubjects, createSubject, updateSubject, deleteSubject } = require('../controllers/subjectController');
const { authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authorizeRoles('ADMIN', 'TEACHER'), listSubjects);
router.post('/', authorizeRoles('ADMIN', 'TEACHER'), createSubject);
router.put('/:id', authorizeRoles('ADMIN', 'TEACHER'), updateSubject);
router.delete('/:id', authorizeRoles('ADMIN'), deleteSubject);

module.exports = router;
