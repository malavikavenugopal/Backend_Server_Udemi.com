const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    price: {
        type: Number,
        required: true
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
       
        required: true
    },
    items: [cartItemSchema]
});

const carts = mongoose.model('carts', cartSchema);

module.exports = carts;