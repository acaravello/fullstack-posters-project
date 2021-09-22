
const mongoose = require('mongoose');
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(process.env.MONGODB_URI || MONGODB_URI, { useNewUrlParser: true });

module.exports = mongoose;
