const express = require('express');
const router = express.Router();
const jwtAuth = require('../Middleware/userMiddleware.js')
const {signup, signin, login} = require('../Controller/userController.js')

router.post('/signup',signup);
router.post('/signin',signin);

router.get('/login',login);
module.exports = router;