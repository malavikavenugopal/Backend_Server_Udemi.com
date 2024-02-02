const express = require('express');

const userControllers = require('../controllers/userController');
//object destructuring
const { check } = require('express-validator')
//Creates a middleware/validation chain for one or more fields that may be located in any of the following:req.body,req.cookies,req.headers,req.params


const router = express.Router();
const multerMiddleware = require('../middleware/multerMiddleware')


router.post('/signup', [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),//normaliaze email : Test@gmail.com => test@gmail.com
    check('password').isLength({ min: 6 })
], userControllers.signup)
router.post('/login', userControllers.login)
router.get('/usersdata', userControllers.getUsers)

router.post("/register", multerMiddleware.single('image'), [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),//normaliaze email : Test@gmail.com => test@gmail.com
    check('password').isLength({ min: 6 })
], userControllers.register)
router.post('/signin', userControllers.signin)
router.get('/userslist', userControllers.getUserslist)

module.exports = router;