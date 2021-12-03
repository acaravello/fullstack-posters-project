

const products = require('../modules/products');
const orders = require('../modules/orders');

exports.productsList = async (req, res, next) => {

    const { limit = 25, offset = 0 } = req.query;
    try {
        const dataRetrieved = await products.getFiles(Number(limit), Number(offset));
        res.json({...dataRetrieved });
    } catch(err) {
        console.log("Error in fetching the products");
        if(!error.statusCode) {
        error.statusCode = 500;
        }
        next(error);
    }
}

exports.getProduct = async (req, res, next) => {
    const { productId } = req.params;
    try {
        const dataRetrieved = await products.getSingleProduct(productId);
        res.json(dataRetrieved);
    } catch(err) {
        console.log("Error in getting product detail");
        if(!error.statusCode) {
        error.statusCode = 500;
        }
        next(error);
    }
}

exports.getOrders = async (req, res, next) => {
    try {
        const { offset = 0, limit = 25 } = req.query;
        const response = await orders.getOrders({
            offset: Number(offset),
            limit: Number(limit),
        });
        res.json(response);
    } catch (err) {
        console.log("Error in getting orders");
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.createOrder = async (req, res, next) => {
    try {
        const addOrder = await orders.postOrder(req.body);
        res.status(200).json({
            message: 'order succesfully placed',
            response: addOrder
        })
    } catch(err) {
        console.log("Error in creating order");
        if(!error.statusCode) {
        error.statusCode = 500;
        }
        next(error);
    }
}