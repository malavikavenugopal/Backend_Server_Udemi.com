const express = require('express');

const reviewController = require('../controllers/reviewController');

const jwtMiddleware = require('../middleware/jwtMiddleware')
const { check } = require('express-validator')

const router = express.Router();

//add reviews(doctor)
router.post('/doctor/add/:id', jwtMiddleware, [
    check('rating').not().isEmpty()
], reviewController.addDoctorReviews)

//get reviews by id(doctor)
router.get('/doctor/:id',jwtMiddleware,reviewController.getDoctorReviewsbyId)

//add reviews(board)
router.post('/board/add/:id', jwtMiddleware, [
    check('rating').not().isEmpty()
], reviewController.addBoardReviews)

//get reviews by id(board)
router.get('/board/:id',jwtMiddleware,reviewController.getBoardReviewsbyId)

//add reviews(groom)
router.post('/groom/add/:id', jwtMiddleware, [
    check('rating').not().isEmpty()
], reviewController.addGroomReviews)

//get reviews by id(groom)
router.get('/groom/:id',jwtMiddleware,reviewController.getGroomReviewsbyId)


module.exports = router;