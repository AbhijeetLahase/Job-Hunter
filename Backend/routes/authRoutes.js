const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register/send-code', authController.sendCode);
router.post('/register/verify-code', authController.verifyCode);

module.exports = router;
