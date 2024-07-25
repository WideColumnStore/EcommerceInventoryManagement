const express = require('express');
const router = express.Router();
const authHandler = require('../handlers/authHandler');

router.post('/signin', authHandler.getToken);
router.post('/signup', authHandler.signUp);

module.exports = router;