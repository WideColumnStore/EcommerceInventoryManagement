const express = require('express');
const router = express.Router();
const testHandler = require('../handlers/testHandler');
const verifyToken = require('../middleware/jwtAuth');

router.get('/', verifyToken, testHandler.getProducts);

module.exports = router;
