const users = require('../models/userSchema')
let DUMMY_PLACES = [
    {
        id: '1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        location: {
            lat: 40.7484474,
            lng: -73.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: '1'
    }
];
const places = require('../models/placeSchema')
const mongoose = require('mongoose')

const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');


updatePlace = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        console.log(errors);
        const error = new HttpError('Invalid inputs passed,please check your data', 422)

        return next(error);
    }
    const { title, description } = req.body;
    const placeId = req.params.id
    const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) }
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId)

    updatePlace.title = title
    updatePlace.description = description
    DUMMY_PLACES[placeIndex] = updatePlace;

    res.status(200).json({ place: updatePlace })

}
const deletePlace = (req, res, next) => {

    const placeId = req.params.pid;
    if (!DUMMY_PLACES.find(p => p.id == placeId)) {
        const error = new HttpError('Could not find place for this id.', 404);
        return next(error);
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId)

    res.status(200).json({ message: 'Deleted Place' })
}

const addPlace = async (req, res, next) => {

    const { title, description, address, location, creator } = req.body
    console.log(description);

    const newPlace = new places({
        title,
        description,
        address,
        image: "",
        location,
        creator
    })

    let user;

    try {
        user = await users.findById(creator);
    } catch (err) {
        const error = new HttpError('Creating place failed, please try again', 500);
        return next(error);

    }
    if (!user) {
        const error = new HttpError('Could not find user for provided id', 404);
        return next(error);
    }
    console.log(user);

    try {

        const sess = await mongoose.startSession();

        sess.startTransaction();
        await newPlace.save({ session: sess });

        user.places.push(newPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();
    }
    catch (err) {
        console.log(err);
    }
    res.status(201).json({ place: newPlace });

}
const getplacebyid = async (req, res) => {
    const id = req.params.id;


    try {
        place = await places.findById(id)
        res.status(200).json(place)



    }
    catch (err) {
        res.status(401).json('GET request FAILED due to', err)

    }

}


const updateplacebyid = async (req, res, next) => {


    const { description } = req.body;
    const id = req.params.id


    let place;
    try {
        place = await places.findById(id)
        console.log(place);
    }
    catch (err) {
        res.status(401).json('PATCH request FAILED due to', err)
    }

    place.description = description

    try {
        await place.save();     
    }
    catch (err) {
        console.log(err)
        const error = new HttpError(
            'Something went wrong, could not update place.',
            500
        );
        return next(error);
    }
    res.status(200).json(place)
}


const deleteplacebyid = async (req, res,next) => {

    const id = req.params.id


    try {

        await places.findOneAndDelete({ _id: id })

    }
    catch (err) {
        console.log(err);
        const error = new HttpError(
            'Something went wrong, could not delete place.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: "Deleted" })



}
module.exports = {
    updatePlace,
    deletePlace,
    addPlace,
    getplacebyid,
    updateplacebyid,
    deleteplacebyid
}