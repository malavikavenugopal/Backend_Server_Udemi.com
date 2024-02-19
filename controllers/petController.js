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
    const { name,breed,gender,age,color,height,weight,info} = req.body

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
        res.status(200).json(newPet)

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
const getPetsbyId = async (req,res)=>{
    try{
        const id = req.payload
        console.log(id)
    
        const existingPets = await pets.findOne({owner:id })
        res.status(200).json(existingPets)
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
const editPet = async (req,res,next)=>{

    const owner_Id = req.payload

    const {age,height,weight,info} = req.body
    
    let pet;
    try{
        pet = await pets.findById({_id:req.params.id})
        console.log(pet);
    }
    catch(err){
        console.log(err);
        return next(new HttpError(
            'Could not find the pet',
            500
        ));
    }
   
    if (pet.owner.toString() !== owner_Id) {

        return next(new HttpError('You are not allowed to edit this pet info', 401));
    }

    pet.age = age ?age:pet.age
    pet.height = height ?height:pet.height
    pet.weight = weight? weight:pet.weight
    pet.info= info?info:pet.info


    try {
        await pet.save();
    }
    catch (err) {
        console.log(err)
        const error = new HttpError(
            'Something went wrong, could not update pet info.',
            500
        );
        return next(error);
    }
    res.status(200).json(pet)

}

//deleting pets info
const deletePet =  async(req,res)=>{
    let pet;
    try{
        await pets.findOneAndDelete({ _id: req.params.id })
        res.status(200).json({message:"Deleted"})
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

