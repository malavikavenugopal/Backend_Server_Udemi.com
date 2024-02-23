const HttpError = require('../models/http-error');

const { validationResult } = require('express-validator')

const carts = require('../models/cartSchema')
const products = require('../models/productSchema')

const addToCart = async (req, res, next) => {
    const { productId, quantity } = req.body;

    console.log(productId, quantity);
    const userId = req.payload;

    try {

        const product = await products.findById(productId);


        if (!product) {
            res.status(404).json({ message: 'Could not find product for the provided ID' });
        }
        // Check if requested quantity exceeds available stock
        if (quantity > product.quantity) {
            return res.status(400).json({ message: 'Requested quantity exceeds available stock' });
        }

        const price = product.price

        let cart = await carts.findOne({ userId });
        if (!cart) {
            cart = new carts({ userId, items: [] });
        }

        const existingItem = cart.items.findIndex(item => item.productId.toString() === productId);
        if (existingItem !== -1) {
            cart.items[existingItem].quantity += quantity;


        } else {
            cart.items.push({ productId, quantity, price });
        }
        // Update remaining quantity in products collection
        product.quantity -= quantity;
        await product.save();
        await cart.save();

        res.status(201).json({ status: true, message: 'Product added to cart successfully', data: cart, No_of_Items: cart.items.length });
    } catch (err) {
        console.log(err);
        const error = new HttpError('Could not add product to cart', 500)
        return next(error)
    }

}

const getCartItemsByUserId = async (req, res, next) => {
    const userId = req.payload;

    try {
        const cart = await carts.findOne({ userId })

        if (!cart) {
            res.status(404).json({ message: 'Could not find cart for the provided user ID' });
        }
        res.status(200).json({ status: true, dataFound: true, data: cart.items, No_of_cartItems: cart.items.length });

    } catch (err) {

        console.log(err);
        const error = new HttpError('Could not get cart items', 500)
        return next(error)

    }
};
const deleteCartItem = async (req, res, next) => {

    const userId = req.payload;
    const itemId = req.params.itemId;

    try {

        let cart = await carts.findOne({ userId });

        if (!cart) {
            res.status(404).json({ message: "Could not find cart for the provided user ID" })
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

        if (itemIndex === -1) {
            res.status(404).json({ message: "Item not found in the cart" })
        }


        const removedItem = cart.items[itemIndex];

        // Increment the product quantity in the products collection
        const product = await products.findOne({ _id: removedItem.productId });
        if (product) {
            product.quantity += removedItem.quantity;

            await product.save();
        }
        cart.items.splice(itemIndex, 1);


        await cart.save();

        res.status(200).json({ status: true, message: 'Item removed from cart successfully', data: cart });
    } catch (err) {
        console.log(err);
        const error = new HttpError('Could not delete item from cart', 500)
        return next(error)

    }
};



module.exports = {
    addToCart,
    getCartItemsByUserId,
    deleteCartItem
}

