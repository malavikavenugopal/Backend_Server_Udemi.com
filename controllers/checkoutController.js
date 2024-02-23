const HttpError = require('../models/http-error');

const { validationResult } = require('express-validator')

const carts = require('../models/cartSchema')
const orders = require('../models/checkoutSchema')



const checkout = async (req, res, next) => {
    const userId = req.payload;
    const { cartId, paymentMethod, shippingAddress } = req.body;

    try {

        const cart = await carts.findById(cartId)
        if (!cart) {
            res.status(404).json({ message: 'Could not find cart for the provided ID' });
        }

        if(cart.items.length ==0){
            res.status(404).json({ message: 'Your Cart is Empty!' });
        }
        
        let totalAmount = 0;
        for (const item of cart.items) {
            totalAmount += item.price * item.quantity;
        }


        const checkout = new orders({
            userId,

            items: cart.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount,
            paymentMethod,
            shippingAddress,
            status: 'pending'
        });

        await checkout.save();
        await carts.findByIdAndDelete(cartId)
        res.status(201).json({ status:true ,message: 'Checkout successful', data :checkout });


    } catch (err) {

        console.log(err);
        const error = new HttpError('Could not process checkout', 500)
        return next(error)
    }
};
const getOrdersByUserId = async (req, res, next) => {
    const userId = req.payload;

    try {

        const order = await orders.find({ userId });

        if (!order) {
            res.status(404).json({ message: "Could not find orders for the provided user ID" })
        }

        res.status(200).json({ status:true,dataFound:true ,message :order });
    } catch (err) {
        console.log(err)
        const error = new HttpError('Could not get orders', 500);
        return next(error)
    }
};
module.exports = {
    checkout,
    getOrdersByUserId
}

