const express = require("express");
const router = express.Router();
const checkToken = require('../modules/check-token');

//Controllers
const adminController = require ("../controllers/admin");

router.post('/products', checkToken, adminController.addProduct);
router.put('/products/:productId', checkToken, adminController.editProduct);
router.delete('/products/:productId', checkToken, adminController.deleteProduct);

module.exports = router;