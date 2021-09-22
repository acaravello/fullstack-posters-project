
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

const getSingleProduct = async (id) => {
   const productFetched = await Product.findById(id);
   return productFetched;
}

 const createProduct = async(product) => {
   const title = product.title;
   const imageLink = product.imageLink;
   const author = product.author;
   const authorLink = product.authorLink;
   const tags = [...product.tags]
   const productToAdd = await new Product({ title, imageLink, author, authorLink, tags }).save();
   return productToAdd;
 }

module.exports = { getFiles, getSingleProduct, createProduct }
