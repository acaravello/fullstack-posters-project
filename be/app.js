
const express = require('express');
const port = process.env.port || 1337;
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
app.listen(port, () => console.log("server running on port " + port));
