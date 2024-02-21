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

        const price = product.price
        if (!product) {
            res.status(404).json({ message: 'Could not find product for the provided ID' });
        }


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

        await cart.save();

        res.status(201).json({ message: 'Product added to cart successfully', cart, No_of_Items: cart.items.length });
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
        res.status(200).json({ cartItems: cart.items, No_of_cartItems: cart.items.length });

    } catch (err) {

        console.log(err);
        const error = new HttpError('Could not get cart items', 500)
        return next(error)

    }
};
const deleteCartItem = async (req, res, next) => {

    const userId = req.payload;
    const itemId = req.params.id;

    try {

        let cart = await carts.findOne({ userId });

        if (!cart) {
            res.status(404).json({ message: "Could not find cart for the provided user ID" })
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

        if (itemIndex === -1) {
            res.status(404).json({ message: "Item not found in the cart" })
        }


        cart.items.splice(itemIndex, 1);


        await cart.save();

        res.status(200).json({ message: 'Item removed from cart successfully',cart});
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

