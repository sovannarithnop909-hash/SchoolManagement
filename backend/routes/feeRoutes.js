const express = require('express');
const { listFees, createFee } = require('../controllers/feeController');
const { authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authorizeRoles('ADMIN', 'ACCOUNTANT'), listFees);
router.post('/', authorizeRoles('ADMIN', 'ACCOUNTANT'), createFee);

module.exports = router;
