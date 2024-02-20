const express = require('express');

const userController = require('../controllers/userController');

const jwtMiddleware = require('../middleware/jwtMiddleware')

const { check } = require('express-validator')

const router = express.Router();

//Register
router.post("/register", [
                            check('name').not().isEmpty(),
                            check('email').normalizeEmail().isEmail(),
                            check('password').isString().isLength({ min: 6 }).not().isLowercase().not().isUppercase().not().isNumeric().not().isAlpha(),
                            check('address').not().isEmpty(),
                         ],
                     userController.register)

//Login                     
router.post('/signin', userController.signin)
//Get All Users
router.get('/', userController.getUsers)
//Get All Users
router.get('/id',jwtMiddleware, userController.getUserbyId)
//Forget Password
router.post('/forget-password',userController.forgetPassword)
//Reset Password
router.patch('/reset-password', [
   
    check('password').isString().isLength({ min: 6 }).not().isLowercase().not().isUppercase().not().isNumeric().not().isAlpha(),
   
 ],userController.resetPassword)
module.exports = router;