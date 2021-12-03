

const products = require('../modules/products');

exports.addProduct = async (req, res, next) => {
    try {
        const addedProduct = await products.createProduct(req.body);
        res.status(201).json({
            message: 'product added successfully',
            product: addedProduct,
        });
    } catch(err) {
        console.log("Error in adding the product");
        if(!error.statusCode) {
        error.statusCode = 500;
        }
        next(error);
    }
}

exports.editProduct = async (req, res, next) => {
    const { productId } = req.params;
    try {
        const editedProduct = await products.editProduct(productId, req.body);
        res.status(200).json({
            message: 'product edited succesfully',
            response: editedProduct
        })
    } catch(err) {
        console.log("Error in editing the product");
        if(!error.statusCode) {
        error.statusCode = 500;
        }
        next(error);
    }
}

exports.deleteProduct = async (req, res, next) => {
    const { productId } = req.params;
    try {   
        const deleteProduct = await products.deleteProduct(productId);
        res.status(201).json({
            message: 'product deleted succesfully',
            response: deleteProduct
        });
    } catch(err) {
        console.log("Error in deleting the product");
        if(!error.statusCode) {
        error.statusCode = 500;
        }
        next(error);
    }
}