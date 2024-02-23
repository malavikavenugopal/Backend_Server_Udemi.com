const express = require('express');

const groomController = require('../controllers/groomController');

const jwtMiddleware = require('../middleware/jwtMiddleware')
const multerConfig = require('../middleware/multerMiddleware')

const { check } = require('express-validator')

const router = express.Router();

//posting grooming places
router.post('/add', multerConfig.single('image'), [
    check('name').not().isEmpty(),
    check('info').not().isEmpty(),
    check('workingDays').not().isEmpty(),
    check('workingTime').not().isEmpty(),
    check('location').not().isEmpty(),
], groomController.createGroomingPlace)

//get all grooming places
router.get('/', jwtMiddleware, groomController.getAllGroomingPlaces)

//get a particular grooming place
router.get('/:groomId',jwtMiddleware,groomController.getAGroomingPlace)
module.exports = router;