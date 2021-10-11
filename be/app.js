
const express = require('express');
const port = process.env.PORT || 8080;
const app = express();
const productsApi = require('./modules/productsAPI');
const middleware = require('./modules/middleware');

app.use(express.json());
app.use(middleware.middlewareCors);
app.get('/products', productsApi.productsList);
app.get('/products/:productId', productsApi.getProduct);
app.post('/products', productsApi.addProduct);
app.put('/products/:productId', productsApi.editProduct);
app.delete('/products/:productId', productsApi.deleteProduct);
app.get('/orders', productsApi.getOrders);
app.post('/orders', productsApi.createOrder);
app.listen(port, () => console.log("server running on port " + port));
