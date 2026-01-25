const express = require('express');
const {
    SignUpController,
    LoginController,
    getApiKey
} = require('../controllers/auth.controller');
const jwtAuthMiddleware=require('../middleware/jwtAuth.middleware')
const router=express.Router();

router.post('/signup',SignUpController);
router.post('/login',LoginController);
router.get('/my-api-key',jwtAuthMiddleware,getApiKey)
module.exports = router;
