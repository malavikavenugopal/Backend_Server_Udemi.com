const HttpError = require('../models/http-error');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');
const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        location: {
            lat: 40.7484474,
            lng: -73.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
];
const users = require('../models/userSchema')

const getPlaceById = (req, res, next) => {
    const id = req.params.id;
    const place = DUMMY_PLACES.find(p => {
        return p.id === id;
    });
    if (!place) {
        throw new HttpError('Could not find a place for the provided id.', 404);
    }
    res.json({ place });
};

//isEmpty(): boolean @returns — true if there are no errors, false otherwise
const addPlace = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('Invalid inputs passed,please check your data', 422)
    }
    const { title, description, coordinates, address, creator }
        = req.body;
    const createdPlace = {

        title,
        description,
        location: coordinates,
        address,
        creator
    };
    DUMMY_PLACES.push(createdPlace);
    res.status(201).json({ place: createdPlace });



}


const DUMMY_USERS = [
    {
        id: "1",
        name: "Malavika",
        email: "malavika@gmail.com",
        password: "snjy5678"
    },
    {
        id: "2",
        name: "Athira",
        email: "athira@gmail.com",
        password: "athi5678"
    }
]

const getUsers = (req, res, next) => {

    res.status(200).json({
        users: DUMMY_USERS
    })

}
const signup = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        console.log(errors);

    }
    const { id, name, email, password } = req.body;
    console.log(id, name);
    const createdUser = {

        name,
        email,
        password
    }
    DUMMY_USERS.push(createdUser)

    res.status(201).json({ user: createdUser })

}
const login = (req, res, next) => {

    const { email, password } = req.body;
    const identifiedUser = DUMMY_USERS.find(u => u.email === email);

    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError("Could not identify user,credentials seem to be wrong", 401)
    }
    res.status(200).json({ message: 'Logged in' })
}

const register = async (req, res, next) => {

    console.log('Inside Register Controller')
    const { name, email, password } = req.body;
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
                'Signing up failed',
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
        image: "",
        password: hashedPassword,
        places: []
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
            //expressed in seconds or a string describing a time span zeit/ms. Eg: 60, "2 days", "10h", "7d"
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    res.status(201).json({ userId: newUser.id, email: newUser.email, token: token })
}

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
            'Logging in failed',
            500
        );
        return next(error);
    }

    res.status(200).json({
        existingUser
        , token: token
    });
}


const getUserslist = async (req, res) => {
    try {
        const userslist = await users.find()
        res.status(200).json(userslist)
    }
    catch (err) {
        res.status(401).json(err)
        console.log(err)
    }

}
module.exports = {
    getUsers,
    login,
    signup,
    addPlace,
    getPlaceById,
    register,
    signin,
    getUserslist
}

