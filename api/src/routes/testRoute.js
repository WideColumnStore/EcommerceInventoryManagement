const express = require('express');
const router = express.Router();
const testHandler = require('../handlers/testHandler');

router.get('/', testHandler.getProducts);

module.exports = router;
