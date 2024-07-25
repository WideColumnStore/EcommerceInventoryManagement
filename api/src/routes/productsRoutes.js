const express = require('express');
const router = express.Router();
const productsHandler = require('../handlers/productsHandler');
const verifyToken = require('../middleware/jwtAuth');

//get
router.get('/all-products', verifyToken, productsHandler.getProducts);
router.get('/products-in-category', verifyToken, productsHandler.countProductsInCategories);
router.get('/products-in-warehouse', verifyToken, productsHandler.countProductsInWarehouse);
router.get('/products-by-quantity', verifyToken, productsHandler.getProductsByQuantity);

//insert
router.post('/add-product', verifyToken, productsHandler.insertProduct);
router.post('/update-stock-quantity', verifyToken, productsHandler.updateStockQuantity);
module.exports = router;
