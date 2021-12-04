
const Order = require('../models/order');

getOrders = async ({limit = 25, offset = 0}) => {
    const orders = await Order.find().sort({ _id: -1 }).skip(offset * limit).limit(limit).populate('products').exec();
    return orders;
}


postOrder = async (order) => {
    const buyerEmail = order.buyerEmail;
    const address = order.address;
    const city = order.city;
    const products = order.products;
    const status = order.status;
    const totalPrice = order.totalPrice;
    const orderToAdd = new Order({ buyerEmail, address, city, products, totalPrice, status}).save();
    return orderToAdd;
}

module.exports = { getOrders, postOrder }