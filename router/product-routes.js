const express = require('express');

const productController = require('../controllers/productController');

const multerConfig = require('../middleware/multerMiddleware')

/* const jwtMiddleware = require('../middleware/jwtMiddleware') */

const { check } = require('express-validator')

const router = express.Router();

//Posting products
router.post('/add', multerConfig.single('image'), [
    check('name').not().isEmpty(),
    check('price').not().isEmpty(),
    check('brand').not().isEmpty(),
    check('quantity').not().isEmpty(),
    check('description').not().isEmpty(),
    check('category').not().isEmpty()
   
], productController.postNewProduct)

//get all products
router.get('/all-products',productController.getAllProducts)

//get all food products
router.get('/all-food-products',productController.getAllFoodProducts)

//get all vet products
router.get('/all-vet-products',productController.getAllVetProducts)

//get all accessories
router.get('/all-accessories',productController.getAllAccessories)

//get all iot-devices
router.get('/all-iot-devices',productController.getAllIotDevices)



module.exports = router;