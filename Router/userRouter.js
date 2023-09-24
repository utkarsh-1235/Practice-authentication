const express = require('express');
const router = express.Router();
const jwtAuth = require('../Middleware/userMiddleware.js')
const {
    signup,
    signin,
    forgotPassword,
    resetPassword,
    login,
    logout
  } = require("../Controller/userController.js");

router.post('/signup',signup);
router.post('/signin',signin);

router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:token", resetPassword);

router.get("/user", jwtAuth, login);
router.get("/logout", jwtAuth, logout);

router.get('/login',login);
module.exports = router;