const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
     
        required: true
    },
   
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
        
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'paypal', 'cash'],
        required: true
    },
    shippingAddress: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        }
    },
    status: { 
        type: String, 
        enum: ['pending', 'processing', 'shipped', 'delivered'], 
        default: 'pending' },
  
},{
    timestamps: {
    }
}
);

const orders = mongoose.model('orders', checkoutSchema);

module.exports = orders
