const express = require('express');
const router = express.Router();
const jwtAuth = require('../Middleware/userMiddleware.js')
const {signup} = require('../Controller/userController.js')

router.post('/signup',signup);

module.exports = router;