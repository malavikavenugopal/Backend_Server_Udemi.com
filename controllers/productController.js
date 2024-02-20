const HttpError = require('../models/http-error');

const { validationResult } = require('express-validator')

const products = require('../models/productSchema')


//Adding new products
const postNewProduct = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const { name, price, brand, quantity, description, category } = req.body

    try {
        const newProduct = new products({
            name,
            price,
            brand,
            quantity,
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
        return next(error); 
    }

}

//Getting all products
const getAllProducts = async (req, res, next) => {
    const searchKey = req.query.search;
    let query = {};

    if (searchKey) {
        query.$or = [
            { name: { $regex: searchKey, $options: 'i' } },
            { description: { $regex: searchKey, $options: 'i' } },
            { brand: { $regex: searchKey, $options: 'i' } }
        ];
    }
    try {

        const allProducts = await products.find(query)
        res.status(200).json(allProducts)
    }
    catch (err) {
        const error = new HttpError(
            'Something went wrong,Please try again later',
            500
        );
        console.log(err);
        return next(error); 
    }

}

//Get all Food Products
const getAllFoodProducts = async (req, res, next) => {
    const searchKey = req.query.search;
    let query = { category: 'Food' };

    if (searchKey) {
        query.$or = [
            { name: { $regex: searchKey, $options: 'i' } },
            { description: { $regex: searchKey, $options: 'i' } },
            { brand: { $regex: searchKey, $options: 'i' } }
        ];
    }

    try {
        const allProducts = await products.find(query);

        if (allProducts.length <= 0) {
            res.status(200).json({ status: 200, message: "Sorry, no products found!", dataFound: false });
        } else {
            res.status(200).json({ dataFound: true, allProducts });
        }
    } catch (err) {
        const error = new HttpError('Something went wrong, please try again later', 500);
        console.log(err);
        return next(error);
    }
};

//Get all Vet Products
const getAllVetProducts = async (req, res, next) => {
    
    const searchKey = req.query.search;
    let query = { category: 'Vet' };
    if (searchKey) {
        query.$or = [
            { name: { $regex: searchKey, $options: 'i' } },
            { description: { $regex: searchKey, $options: 'i' } },
            { brand: { $regex: searchKey, $options: 'i' } }
        ];
    }

    try {

        const allProducts = await products.find(query)
        

        if(allProducts.length<=0){
        res.status(200).json({status:200,message : "Sorry,No products found!",dataFound:false})
        }
        else{
        res.status(200).json({dataFound:true,allProducts})
        }

    }
    catch (err) {
        const error = new HttpError(
            'Something went wrong,Please try again later',
            500
        );
        console.log(err);
        return next(error); 
    }

}

//Get all Accessories 
const getAllAccessories = async (req, res, next) => {
   

    const searchKey = req.query.search;
    let query = { category: 'Accessories' };

    if (searchKey) {
        query.$or = [
            { name: { $regex: searchKey, $options: 'i' } },
            { description: { $regex: searchKey, $options: 'i' } },
            { brand: { $regex: searchKey, $options: 'i' } }
        ];
    }

    
    try {

        const allProducts = await products.find(query)
        

        if(allProducts.length<=0){
            res.status(200).json({status:200,message : "Sorry,No products found!",dataFound:false})
            }
            else{
            res.status(200).json({dataFound:true,allProducts})
            }

    }
    catch (err) {
        const error = new HttpError(
            'Something went wrong,Please try again later',
            500
        );
        console.log(err);
        return next(error); 
    }

}
//Get all Iot Devices
const getAllIotDevices = async (req, res, next) => {
    const searchKey = req.query.search;
    let query = { category: 'Iot-Devices' };

    if (searchKey) {
        query.$or = [
            { name: { $regex: searchKey, $options: 'i' } },
            { description: { $regex: searchKey, $options: 'i' } },
            { brand: { $regex: searchKey, $options: 'i' } }
        ];
    }
    
    try {

        const allProducts = await products.find(query)
        
        if(allProducts.length<=0){
            res.status(200).json({status:200,message : "Sorry,No products found!",dataFound:false})
            }
            else{
            res.status(200).json({dataFound:true,allProducts})
            }

    }
    catch (err) {
        const error = new HttpError(
            'Something went wrong,Please try again later',
            500
        );
      
        console.log(err);
        return next(error); 
    }

}

module.exports = {
    postNewProduct,
    getAllProducts,
    getAllVetProducts,
    getAllFoodProducts,
    getAllAccessories,
    getAllIotDevices
}

