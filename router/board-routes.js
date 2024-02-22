const express = require('express');

const boardController = require('../controllers/boardController');

const jwtMiddleware = require('../middleware/jwtMiddleware')
const multerConfig = require('../middleware/multerMiddleware')

const { check } = require('express-validator')

const router = express.Router();

//posting boarding places
router.post('/add', multerConfig.single("image"),[
    check('name').not().isEmpty(),
    check('info').not().isEmpty(),
    check('workingDays').not().isEmpty(),
    check('workingTime').not().isEmpty(),
    check('location').not().isEmpty(),
],boardController.createBoardingplaces)

//get all boarding places
router.get('/', jwtMiddleware, boardController.getAllBoardingPlaces)


//get a particular boardingbplace
router.get('/:id',jwtMiddleware,boardController.getABoardingPlace)
module.exports = router;