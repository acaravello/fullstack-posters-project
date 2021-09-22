
const db = require('../modules/db');
const cuid = require('cuid');
const Product = db.model('Product', {
    _id: { type: String, default: cuid },
    title: String,
    imageLink: String,
    author: String,
    authorLink: String,
    tags: [{
        type: String,
    }]
});

module.exports = Product;


