
const db = require('../modules/db');
const cuid = require('cuid');
const { isURL } = require('validator');
const Product = db.model('Product', {
    _id: { type: String, default: cuid },
    title: { type: String, required: true },
    imageLink: { type: String, required: true, validate: {
        validator: isURL,
        message: props => `${props.value} is not a valid URL`
    }},
    author: { type: String, required: true },
    authorLink: { type: String, required: true, validate: {
        validator: isURL,
        message: props => `${props.value} is not a valid URL`
    } },
    tags: [{
        type: String,
    }]
});

module.exports = Product;


