const express = require('express');
const router = express.Router();
const productsHandler = require('../handlers/productsHandler');

//get
router.get('/all-products', productsHandler.getProducts);
router.get('/products-by-category', productsHandler.getProductsByCategory);
router.get('/products-by-warehouse', productsHandler.getProductsByWarehouse);
router.get('/transactions-by-date', productsHandler.getTransactionsByDate);
router.get('/products-by-quantity', productsHandler.getProductsByQuantity);

//insert
router.post('/add-product', productsHandler.insertProduct);
router.post('/add-new-transaction', productsHandler.addNewTransaction);
router.post('/update-stock-quantity', productsHandler.updateStockQuantity);
module.exports = router;
