const express = require('express');
const { listClasses, createClass, updateClass, deleteClass } = require('../controllers/classController');
const { authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authorizeRoles('ADMIN', 'TEACHER'), listClasses);
router.post('/', authorizeRoles('ADMIN'), createClass);
router.put('/:id', authorizeRoles('ADMIN'), updateClass);
router.delete('/:id', authorizeRoles('ADMIN'), deleteClass);

module.exports = router;
