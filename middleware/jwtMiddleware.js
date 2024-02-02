
const jwt = require("jsonwebtoken")

const HttpError = require('../models/http-error');

const jwtmiddlewear = (req, res, next) => {


    const token = req.headers['authorization'].split(' ')[1]// Authorization: 'Bearer TOKEN'
    console.log(token)
    if (!token) {
        throw new Error('Authentication failed!');
    }
    try {
        const jwtResponse = jwt.verify(token, "supersecret_dont_share")
        console.log(jwtResponse)

        req.payload = jwtResponse.userId 

        next()

    } catch (err) {
        const error = new HttpError('Authentication failed!', 403);
        return next(error);
    }

}
module.exports = jwtmiddlewear