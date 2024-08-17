const express = require('express');
const { signUp, login } = require('../../controllers/users/userControllers');

//! Router Object
const router = express.Router();

//! Routes
router.post("/signup", signUp);
router.post("/login", login);

module.exports = router;