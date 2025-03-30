const express = require('express');
const { customerLogin } = require('../Auth/authController');

const router = express.Router();

router.post('/login', customerLogin);

module.exports = router;