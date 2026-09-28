const express = require('express');
const { listNotices, createNotice, updateNotice, deleteNotice } = require('../controllers/noticeController');
const { authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', listNotices);
router.post('/', authorizeRoles('ADMIN', 'TEACHER'), createNotice);
router.put('/:id', authorizeRoles('ADMIN', 'TEACHER'), updateNotice);
router.delete('/:id', authorizeRoles('ADMIN'), deleteNotice);

module.exports = router;
