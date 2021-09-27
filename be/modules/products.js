
const Product = require('../models/product');

const getFiles = async (limit = 25, offset = 0) => {
   const products = await Product.find().sort({ _id: -1 }).skip(offset * limit).limit(limit);
   const count = await Product.count();
   const data = {
      totalLength: count,
      products
   }
   return data;
}

const getSingleProduct = async (productId) => {
   const productFetched = await Product.findById(productId);
   return productFetched;
}

 const createProduct = async(product) => {
   const title = product.title;
   const imageLink = product.imageLink;
   const author = product.author;
   const authorLink = product.authorLink;
   const price = product.price;
   const tags = [...product.tags];
   const productToAdd = await new Product({ title, imageLink, author, authorLink, price, tags }).save();
   return productToAdd;
 }

 const editProduct = async (productId, product) => {
   const title = product.title;
   const imageLink = product.imageLink;
   const author = product.author;
   const authorLink = product.authorLink;
   const price = product.price;
   const tags = [...product.tags];
   const productToEdit = { title, imageLink, author, authorLink, price, tags }
   const editOperation = await Product.updateOne({_id: productId }, productToEdit);
   return editOperation;
 }

 const deleteProduct = async (productId) => {
    const deleteOperation = await Product.deleteOne({ _id: productId });
    return deleteOperation;
 }

module.exports = { getFiles, getSingleProduct, createProduct, deleteProduct, editProduct }
