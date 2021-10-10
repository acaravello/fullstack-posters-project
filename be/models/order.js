
const db = require('../modules/db');
const cuid = require('cuid');
const { isEmail } = require('validator');

const Order = db.model('Order', {
    _id: { type: String, default: cuid },
    buyerEmail: { type: String, required: true, validate: {
        validator: isEmail,
        message: props => `${props.value} is not a valid e-mail`
    }},
    products: [{
        type: Object,
        // ref: 'Product',
        index: true,
        required: true
    }],
    totalPrice: { type: String, required: true},
    status: {
        type: String, 
        index: true,
        default: 'CREATED',
        enum: ['CREATED', 'PENDING', 'COMPLETED']
    }
});

module.exports = Order;