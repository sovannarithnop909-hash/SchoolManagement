const express = require('express');
const { listUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authorizeRoles('ADMIN'), listUsers);
router.post('/', authorizeRoles('ADMIN'), createUser);
router.put('/:id', authorizeRoles('ADMIN'), updateUser);
router.delete('/:id', authorizeRoles('ADMIN'), deleteUser);

module.exports = router;
