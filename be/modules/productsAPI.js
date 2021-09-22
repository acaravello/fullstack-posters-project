
const products = require('../modules/products');

const productsList = async (req, res) => {
    const { limit = 25, offset = 0 } = req.query;
    try {
        const dataRetrieved = await products.getFiles(Number(limit), Number(offset));
        res.json(dataRetrieved);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

const getProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const dataRetrieved = await products.getSingleProduct(productId);
        res.json(dataRetrieved);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

const addProduct = async (req, res) => {
    try {
        const addedProduct = await products.createProduct(req.body);
        res.status(201).json({
            message: 'product added successfully',
            product: addedProduct,
        });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

const editProduct = async (req,res) => {
    const { productId } = req.params;
    console.log("product to edit req is");
    console.log(productId);
    console.log(req.body);
}

const deleteProduct = (req, res) => {
    const { productId } = req.params;
    console.log("product to delete");
    console.log(productId);
}

module.exports = { productsList, getProduct, addProduct, editProduct, deleteProduct }
