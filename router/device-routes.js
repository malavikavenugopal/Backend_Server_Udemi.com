const express = require('express');

const deviceController = require('../controllers/deviceController');

const jwtMiddleware = require('../middleware/jwtMiddleware')
const multerConfig = require('../middleware/multerMiddleware')

const { check } = require('express-validator')

const router = express.Router();
//adding pet device
router.post('/add',jwtMiddleware,multerConfig.single('image'), [
    check('name').not().isEmpty()
],deviceController.postingPetDevice)
//getting pet devices by userId
router.get('/',jwtMiddleware,deviceController.getAllPetDevicesbyUserId)
//get a particular pet devices
router.get('/:deviceId',jwtMiddleware,deviceController.getAPetDevice)
module.exports = router;