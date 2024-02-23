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
    const { name, breed, gender, age, color, height, weight, info } = req.body

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
            info,
            image: req.file.filename,
            owner

        })

        await newPet.save()
        res.status(200).json({ status: true, message: "Successfully added", data: newPet })

    }
    catch (err) {
        const error = new HttpError(
            'Posting new pet failed,Please try again later',
            500
        );
        console.log(err);
    }


}

//Getting Pets by Owner Id
const getPetsbyId = async (req, res) => {
    try {
        const id = req.payload
        console.log(id)

        const existingPets = await pets.find({ owner: id })
        res.status(200).json({ status: true, dataFound: true, data: existingPets })
        if (!existingPets) {
            const error = new HttpError(
                'Could not find any pets',
                500
            );
            return next(error);
        }

    }
    catch (err) {
        res.status(401).json('Something went wrong, please try again')
        console.log(err)
    }
}
//editing pets info
const editPet = async (req, res, next) => {

    const owner_Id = req.payload

    const { age, height, weight, info } = req.body
console.log(req.params.petId)

    try {
        let pet;

        pet = await pets.findById({ _id: req.params.petId })
        console.log(pet);
       

        pet.age = age ? age : pet.age
        pet.height = height ? height : pet.height
        pet.weight = weight ? weight : pet.weight
        pet.info = info ? info : pet.info


        await pet.save();
        res.status(200).json({ status: true, message: "Updated successfully", data: pet })
    }
    catch (err) {
        console.log(err)
        const error = new HttpError(
            'Something went wrong, could not update pet info.',
            500
        );
        return next(error);
    }


}

//deleting pets info
const deletePet = async (req, res) => {
    let pet;
    try {
        await pets.findOneAndDelete({ _id: req.params.petId })
        res.status(200).json({ status: true, message: "Deleted" })
    }
    catch (err) {
        console.log(err)
        const error = new HttpError(
            'Something went wrong, could not delete the pet',
            500
        );
        return next(error);
    }
}



module.exports = {
    postPets,
    getPetsbyId,
    editPet,
    deletePet
}

