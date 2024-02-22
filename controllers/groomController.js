const HttpError = require('../models/http-error');

const { validationResult } = require('express-validator')

const grooms = require('../models/groomSchema')

//posting grooming places
const createGroomingPlace = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    try {

        const { name, info, workingDays, workingTime, location } = req.body;


        const newGroom = new grooms({
            name,
            image: req.file.filename,
            info,
            workingDays,
            workingTime,
            location
        });


        await newGroom.save();


        res.status(201).json({ message: 'Grooming place created successfully', GroomingPlace: newGroom });
    } catch (error) {

        console.error(error);
        const err = new HttpError(
            'Internal Server Error',
            500
        );
        return next(err);
    }
}

//get allgrooming places
const getAllGroomingPlaces = async (req, res, next) => {
    try {

        const groomingPlaces = await grooms.find();
        if (groomingPlaces.length == 0) {
            res.status(404).json({ message: "No Grooming Places Found!" })
        }

        res.status(200).json({ groomingPlaces });
    } catch (err) {

        console.error('Error fetching grooming places:', err);
        const error = new HttpError(
            'Internal Server Error',
            500
        );
        return next(error);
    }
}

//get a particular Grooming place
const getAGroomingPlace = async (req, res, next) => {
    const groomId = req.params.id
    try {
        const groom = await grooms.findById(groomId)
        res.status(200).json({ GroomingPlace: groom })
    }
    catch (err) {

        console.error('Error fetching grooming place:', err);
        const error = new HttpError(
            'Internal Server Error',
            500
        );
        return next(error);
    }
}


module.exports = {
    createGroomingPlace,
    getAllGroomingPlaces,
    getAGroomingPlace
}
