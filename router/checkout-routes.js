const express = require('express');

const checkoutController = require('../controllers/checkoutController');

const jwtMiddleware = require('../middleware/jwtMiddleware')

const { check } = require('express-validator')

const router = express.Router();

//Checkout
router.post('/add',jwtMiddleware,checkoutController.checkout)

//getOrdersByUserId
router.get('/users',jwtMiddleware,checkoutController.getOrdersByUserId)

module.exports = router;