const express = require("express");
const router = express.Router();

//Controllers
const shopController = require("../controllers/shop");

router.get('/products', shopController.productsList );
router.get('/products/:productId', shopController.getProduct);
router.get('/orders', shopController.getOrders);
router.post('/orders', shopController.createOrder);

module.exports = router;