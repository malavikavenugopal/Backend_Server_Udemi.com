const HttpError = require('../models/http-error');

const { validationResult } = require('express-validator')

const boards = require('../models/boardSchema')

//posting boarding places
const createBoardingplaces = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    try {

        const { name, info, workingDays, workingTime, location } = req.body;


        const newBoard = new boards({
            name,
            image: req.file.filename,
            info,
            workingDays,
            workingTime,
            location
        });


        await newBoard.save();


        res.status(201).json({ status: true, message: 'Boarding place created successfully', data: newBoard });
    } catch (error) {

        console.error(error);
        const err = new HttpError(
            'Internal Server Error',
            500
        );
        return next(err);
    }
}

//get all boarding places
const getAllBoardingPlaces = async (req, res, next) => {
    try {

        const boardingPlaces = await boards.find();
        if (boardingPlaces.length == 0) {
            res.status(404).json({ message: "No Boarding Places Found!" })
        }

        res.status(200).json({ status: true, dataFound: true, data: boardingPlaces });
    } catch (err) {

        console.error('Error fetching boarding places:', err);
        const error = new HttpError(
            'Internal Server Error',
            500
        );
        return next(error);
    }
}
//get a particular boarding place
const getABoardingPlace = async (req, res, next) => {
    const boardId = req.params.id
    try {
        const board = await boards.findById(boardId)
        res.status(200).json({ status: true, dataFound: true, data: board })
    }
    catch (err) {

        console.error('Error fetching boarding place:', err);
        const error = new HttpError(
            'Internal Server Error',
            500
        );
        return next(error);
    }
}

module.exports = {
    createBoardingplaces,
    getAllBoardingPlaces,
    getABoardingPlace
}

