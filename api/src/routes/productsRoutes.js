const express = require('express');
const router = express.Router();
const productsHandler = require('../handlers/productsHandler');

//get
router.get('/all-products', productsHandler.getProducts);
router.get('/products-in-category', productsHandler.countProductsInCategories);
router.get('/products-in-warehouse', productsHandler.countProductsInWarehouse);
router.get('/products-by-quantity', productsHandler.getProductsByQuantity);

//insert
router.post('/add-product', productsHandler.insertProduct);
router.post('/update-stock-quantity', productsHandler.updateStockQuantity);
module.exports = router;
