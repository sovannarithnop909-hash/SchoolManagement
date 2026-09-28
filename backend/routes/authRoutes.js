const express = require('express');
const {
    register,
    login,
    getProfile,
    updateProfilePhoto,
} = require('../controllers/authController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authenticateToken, authorizeRoles('ADMIN'), register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile/photo', authenticateToken, updateProfilePhoto);

module.exports = router;
