const express = require('express');

const userControllers = require('../controllers/userController');
//object destructuring
const { check } = require('express-validator')
//Creates a middleware/validation chain for one or more fields that may be located in any of the following:req.body,req.cookies,req.headers,req.params
const router = express.Router();

router.get('/userlist/:id', userControllers.getPlaceById)
//validating API input(request bodies)

//Result.isEmpty(): boolean @returns — true if there are no errors, false otherwise
//not ()-@returns — the current validation chain
//isLength(options: MinMaxOptions): ValidationChain
router.post('/post', [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty()
]
    , userControllers.addPlace)


router.post('/signup', [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),//normaliaze email : Test@gmail.com => test@gmail.com
    check('password').isLength({ min: 6 })
], userControllers.signup)
router.post('/login', userControllers.login)
router.get('/usersdata', userControllers.getUsers)

router.post("/register",[
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),//normaliaze email : Test@gmail.com => test@gmail.com
    check('password').isLength({ min: 6 })
], userControllers.register)
router.post('/signin', userControllers.signin)
router.get('/userslist', userControllers.getUserslist)

module.exports = router;