const HttpError = require('../models/http-error');

const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator')

const jwt = require('jsonwebtoken');

const users = require('../models/userSchema')

const nodemailer = require('nodemailer')

const randomstring = require('randomstring')


const sendResetPasswordMail = async (name, email, token) => {


    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: '9f2dae88b56d7b',
                pass: 'cac446d79082d5'
            }
        });

        const mailOptions = {
            from: 'Jonas <hello@jonas.io>',
            to: email,
            subject: 'For Reset Password - Pet Care',
            html: `<p>   Hii ${name}, please copy the link & <a href='http://localhost:4000/users/reset-password?token=${token}'> Reset your password</a></p>`
        };

        await transporter.sendMail(mailOptions);
        console.log("Reset password email sent successfully.");
    } catch (err) {
        console.error("Error occurred while sending reset password email:", err);
        throw err;
    }
}


//Registeration of Users
const register = async (req, res, next) => {

    console.log('Inside Register Controller')
    const { name, email, password, address } = req.body;
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
        address,
        token:null
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

    res.status(201).json({ userId: newUser.id, email: newUser.email, token: token })
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

    res.status(200).json({ existingUser, token: token });


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
const getUserbyId = async (req, res) => {
    try {
        const id = req.payload
        console.log(id)

        const existingUser = await users.findOne({ _id: id })
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
//Forget Password
const forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    let existingUser;
    try {
        existingUser = await users.findOne({ email })

        if (existingUser) {
            const randomString = randomstring.generate()
            const data = await users.updateOne({ email: email }, { $set: { token: randomString } })

            sendResetPasswordMail(existingUser.name, existingUser.email, randomString)
            res.status(200).json({
                message: "Please check your inbox of mail and reset your password",
                token: randomString
            })


        }
        else {
            res.status(200).json({ message: "Email does not exists" })
        }

    }
    catch (err) {
        const error = new HttpError(
            'Forgetpassword request failed',
            500
        );
        console.log(err);
        return next(error)
    }
}

//Reset-Password
const resetPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const token = req.query.token
    const { password } = req.body
    let existingUser;
    try {
        if (!token) {
            return next(new HttpError('Token is required.', 422));
        }
        existingUser = await users.findOne({ token: token })
        if (existingUser) {
            let hashedPassword;
            try {
                hashedPassword = await bcrypt.hash(password, 12);
            } catch (err) {
                return next(new HttpError('An error occurred while hashing the password.', 500));
            }

            existingUser.password = hashedPassword
            existingUser.token = null
            try {
                await existingUser.save()
                res.status(200).json(existingUser)
            }
            catch (err) {
                console.log(err)
                return next(new HttpError('An error occurred while saving the updated password.', 500));
            }
        }
        else {
            return res.status(404).json({ message: 'User not found with this token.' });
        }
    }
    catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong, could not reset the password.', 500));
    }


}

const logout = async (req, res) => {
  
    res.status(200).json({ message: 'Logout successful' });
};

module.exports = { logout };


module.exports = {
    register,
    signin,
    getUsers,
    getUserbyId,
    forgetPassword,
    resetPassword,
    logout
}

