const express = require('express');

const productController = require('../controllers/productController');

const multerConfig = require('../middleware/multerMiddleware')

const jwtMiddleware = require('../middleware/jwtMiddleware')

const { check } = require('express-validator')

const router = express.Router();

//Posting products
router.post('/add', multerConfig.single('image'), [
    check('name').not().isEmpty(),
    check('price').not().isEmpty(),
    check('description').not().isEmpty(),
    check('category').not().isEmpty()
   
], productController.postNewProduct)


module.exports = router;