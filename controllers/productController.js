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
        res.status(200).json({status:true,message:"Product added successfully",newProduct})
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

//Update the quantity of products
const updateProductQuantity = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const productId = req.params.id;
    const { quantity } = req.body;
    console.log(productId);

    try {

        const product = await products.findOne({ _id: productId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.quantity = quantity;


        await product.save();

        res.status(200).json({ status:true, message: 'Product quantity updated successfully', data :product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update product quantity' });
    }
};


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
        res.status(200).json({status:true,dataFound:true,data:allProducts})
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
            res.status(200).json({ status :true, dataFound: true, data :allProducts });
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


        if (allProducts.length <= 0) {
            res.status(200).json({ status: 200, message: "Sorry,No products found!", dataFound: false })
        }
        else {
            res.status(200).json({ status :true,dataFound: true,data: allProducts })
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


        if (allProducts.length <= 0) {
            res.status(200).json({ status: 200, message: "Sorry,No products found!", dataFound: false })
        }
        else {
            res.status(200).json({  status :true,dataFound: true,data: allProducts })
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

        if (allProducts.length <= 0) {
            res.status(200).json({ status: 200, message: "Sorry,No products found!", dataFound: false })
        }
        else {
            res.status(200).json({  status :true,dataFound: true,data: allProducts })
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

//get Particular Product 
const getParticularProduct = async (req, res, next) => {
    const id = req.params.id
    try {
        const product = await products.findById(id)
        if (!product) {
            res.status(404).json({ message: 'Could not find product for the provided ID' })
        }
        res.status(200).json({status:true,dataFound:true ,data:product})
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
    getAllIotDevices,
    getParticularProduct,
    updateProductQuantity
}

