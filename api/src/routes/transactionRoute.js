const express = require('express');
const router = express.Router();
const transactionHandler = require('../handlers/transactionHandler');

router.get('/:transaction_date', transactionHandler.getProductSales);

module.exports = router;
