const express = require('express');
const {
    SignUpController,
    LoginController
} = require('../controllers/auth.controller');

const router=express.Router();

router.post('/signup',SignUpController);
router.post('/login',LoginController);

module.exports = router;
