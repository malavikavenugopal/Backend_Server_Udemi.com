const express = require('express');

const cartController = require('../controllers/cartController');

const jwtMiddleware = require('../middleware/jwtMiddleware')
const { check } = require('express-validator')

const router = express.Router();
//add to cart
router.post('/add',jwtMiddleware,cartController.addToCart)

//get cart items by userId
router.get('/users',jwtMiddleware,cartController.getCartItemsByUserId)

//delete cart item
router.patch('/delete/:id',jwtMiddleware,cartController.deleteCartItem)


module.exports = router;