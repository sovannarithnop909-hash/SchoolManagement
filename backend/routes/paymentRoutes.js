const express = require('express');
const { listPayments, createPayment } = require('../controllers/paymentController');
const { authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authorizeRoles('ADMIN', 'ACCOUNTANT'), listPayments);
router.post('/', authorizeRoles('ADMIN', 'ACCOUNTANT'), createPayment);

module.exports = router;
