const express = require('express');
const router = express.Router();
const transactionHandler = require('../handlers/transactionHandler');
const verifyToken = require('../middleware/jwtAuth');

router.get('/:transaction_date', verifyToken, transactionHandler.getProductSales);

module.exports = router;
