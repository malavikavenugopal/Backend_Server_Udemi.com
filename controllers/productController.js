const HttpError = require('../models/http-error');

const { validationResult } = require('express-validator')

const products = require('../models/productSchema')


const postNewProduct = async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const {name,price,description,category} = req.body

    try{
    const newProduct = new products({
                name,
                price,
                description,
                category,
                image: req.file.filename
    })
    await newProduct.save()
    res.status(200).json(newProduct)
    }
    catch (err) {
        const error = new HttpError(
            'Posting new pet failed,Please try again later',
            500
        );
        console.log(err);
    }
   
}


module.exports = {
 postNewProduct
}

