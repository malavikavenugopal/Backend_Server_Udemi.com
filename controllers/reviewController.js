const HttpError = require('../models/http-error');

const { validationResult } = require('express-validator')
const doctors = require('../models/veterinarySchema')
const users = require('../models/userSchema')
const reviews = require('../models/reviewSchema')
const boards = require('../models/boardSchema')
const grooms = require('../models/groomSchema')
//add reviews doctor
const addDoctorReviews = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    try {
        const userId = req.payload
        const doctorId = req.params.id;
        const { rating, comment } = req.body;

        const user = await users.findById(userId)
        const doctor = await doctors.findById(doctorId);
        if (!doctor) {
            res.status(404).json({ message: 'Doctor not found' })
        }


        const newReview = new reviews({
           clinicId : doctorId,
            user: user.name,
            rating,
            comment
        });

        await newReview.save();
        res.status(201).json({status :true, message: 'Review posted successfully' });
    } catch (err) {

        console.error(err);
        const error = new HttpError(
            'Internal Server Error',
            500
        );
        return next(error);

    }
}

//get all reviews of particular doctor
const getDoctorReviewsbyId = async (req, res, next) => {
    try {

        const doctorId = req.params.id;

        const doctor = await doctors.findById(doctorId);
        if (!doctor) {
            res.status(404).json({ message: 'Doctor not found' })
        }
        const allReviews = await reviews.find({ clinicId: doctorId });
        if (allReviews.length == 0) {
            res.status(404).json({ message: 'Reviews not found ' })
        }

        let totalRating = 0;
        allReviews.forEach(review => {
            totalRating += review.rating;
        });

        const averageRating = totalRating / allReviews.length;


        res.status(201).json({
            status:true,dataFound:true,data :{
            Doctor: doctor.name, Reviews: allReviews, Average_Rating: averageRating, No_Of_Reviews: allReviews.length } });
    } catch (err) {

        console.error(err);
        const error = new HttpError(
            'Internal Server Error',
            500
        );
        return next(error);

    }
}
//add boarding reviews
const addBoardReviews = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    try {
        const userId = req.payload
        const boardId = req.params.id;
        const { rating, comment } = req.body;

        const user = await users.findById(userId)
        const board = await boards.findById(boardId);
        if (!board) {
            res.status(404).json({ message: 'Boarding place not found' })
        }


        const newReview = new reviews({
           clinicId : boardId,
            user: user.name,
            rating,
            comment
        });

        await newReview.save();
        res.status(201).json({status :true, message: 'Review posted successfully' });
    } catch (err) {

        console.error(err);
        const error = new HttpError(
            'Internal Server Error',
            500
        );
        return next(error);

    }
}
//get all boarding reviews by id
const getBoardReviewsbyId = async (req, res, next) => {
    try {

        const boardId = req.params.id;
        console.log(boardId)

        const board = await boards.findById(boardId);
        if (!board) {
            res.status(404).json({ message: 'Boarding place not found' })
        }
        const allReviews = await reviews.find({ clinicId: boardId});
        if (allReviews.length == 0) {
            res.status(404).json({ message: 'Reviews not found ' })
        }

        let totalRating = 0;
        allReviews.forEach(review => {
            totalRating += review.rating;
        });

        const averageRating = totalRating / allReviews.length;


        res.status(201).json({  status:true,dataFound:true,data :{ Boarding_Place_Name: board.name, Reviews: allReviews, Average_Rating: averageRating, No_Of_Reviews: allReviews.length} });
    } catch (err) {

        console.error(err);
        const error = new HttpError(
            'Internal Server Error',
            500
        );
        return next(error);

    }
}
//add grooming reviews
const addGroomReviews = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    try {
        const userId = req.payload
        const groomId = req.params.id;
        const { rating, comment } = req.body;

        const user = await users.findById(userId)
        const groom = await grooms.findById(groomId);
        if (!groom) {
            res.status(404).json({ message: 'Grooming place not found' })
        }


        const newReview = new reviews({
           clinicId :groomId,
            user: user.name,
            rating,
            comment
        });

        await newReview.save();
        res.status(201).json({ status:true, message: 'Review posted successfully' });
    } catch (err) {

        console.error(err);
        const error = new HttpError(
            'Internal Server Error',
            500
        );
        return next(error);

    }
}
//get all groooming reviews by id
const getGroomReviewsbyId = async (req, res, next) => {
    try {

        const groomId = req.params.id;
      

        const groom = await grooms.findById(groomId);
        if (!groom) {
            res.status(404).json({ message: 'Grooming place not found' })
        }
        const allReviews = await reviews.find({ clinicId: groomId});
        if (allReviews.length == 0) {
            res.status(404).json({ message: 'Reviews not found ' })
        }

        let totalRating = 0;
        allReviews.forEach(review => {
            totalRating += review.rating;
        });

        const averageRating = totalRating / allReviews.length;


        res.status(201).json({  status:true,
            dataFound:true,
            data :{
             Grooming_Place_Name:groom.name, Reviews: allReviews, Average_Rating: averageRating, No_Of_Reviews: allReviews.length} });
    } catch (err) {

        console.error(err);
        const error = new HttpError(
            'Internal Server Error',
            500
        );
        return next(error);

    }
}
module.exports = {
    addDoctorReviews,
    getDoctorReviewsbyId,
    addBoardReviews,
    getBoardReviewsbyId,
    addGroomReviews,
    getGroomReviewsbyId

}

