const HttpError = require('../models/http-error');

const { validationResult } = require('express-validator')

const pets = require('../models/petSchema')

//Adding Pets
const postPets = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const { name, breed, gender, age, color, height, weight } = req.body

    const owner = req.payload

    try {
        const newPet = new pets({
            name,
            breed,
            gender,
            age,
            color,
            height,
            weight,
            image: req.file.filename,
            owner

        })

        await newPet.save()
        res.status(200).json(newPet)

    }
    catch (err) {
        const error = new HttpError(
            'Posting pet failed,Please try again later',
            500
        );
        console.log(err);
    }


}

module.exports = {
    postPets
}

