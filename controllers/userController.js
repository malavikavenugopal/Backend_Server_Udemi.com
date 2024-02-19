const HttpError = require('../models/http-error');

const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator')

const jwt = require('jsonwebtoken');

const users = require('../models/userSchema')

//Registeration of Users
const register = async (req, res, next) => {

    console.log('Inside Register Controller')
    const { name, email, password ,address} = req.body;
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        console.log(errors);
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            const error = new HttpError(
                'Signing up failed,User already exists',
                500
            );
            return next(error);
        }
    }
    catch (err) {
        res.status(401).json(err)
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError(
            'Could not create user, please try again.',
            500
        );
        return next(error);
    }


    const newUser = new users({
        name,
        email,
        password: hashedPassword,
        address
    })

    try {
        await newUser.save()
    }
    catch (err) {
        console.log(err);
    }
    
    let token;
    try {
        token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            'supersecret_dont_share',
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Signup failed',
             500
        );
        return next(error);
    }

    res.status(201).json({ userId: newUser.id, email: newUser.email ,token :token})
}

//Logging of Users
const signin = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await users.findOne({ email })


    }
    catch (err) {
        const error = new HttpError(
            'Logging failed',
            500
        );
        return next(error)
    }
    if (!existingUser) {

        const error = new HttpError(
            'Invalid Email',
            403
        );
        return next(error);
    }
    let isValid = false;
    try {
        isValid = await bcrypt.compare(password, existingUser.password);

    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'Please check your credentials and try again.',
            500
        );
        return next(error);


    }

    if (!isValid) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            403
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            'supersecret_dont_share',
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Login failed',
             500
        );
        return next(error);
    }

    res.status(200).json({ existingUser,token: token });

    
}

//Get all Users
const getUsers = async (req, res) => {
    try {
        const userslist = await users.find()
        res.status(200).json(userslist)
    }
    catch (err) {
        res.status(401).json(err)
        console.log(err)
    }

}

//Get Particular User by ID
const getUserbyId =  async (req,res) =>{
    try{
        const id = req.payload
        console.log(id)
    
        const existingUser = await users.findOne({ _id:id })
        res.status(200).json(existingUser)
        if (!existingUser) {
            const error = new HttpError(
                'Could not find user, please try again.',
                500
            );
            return next(error);  
        }
        
    }
    catch (err) {
        res.status(401).json('Could not find user, please try again')
        console.log(err)
    }
}

module.exports = {
    register,
    signin,
    getUsers,
    getUserbyId
}

