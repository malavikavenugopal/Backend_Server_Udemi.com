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



//cookies

//cookie(name: string, val: string, options: CookieOptions)

router.get('/set-cookie', (req, res) => {
    
    res.cookie('fizz', 'buzz')
    console.log(req.cookies)
    res.send('Cookies are set')
  })
  
 router.get('/get-cookie', (req, res) => {
    console.log(req.cookies)
    res.send(req.cookies)
  })
  
  router.get('/del-cookie', (req, res) => {
    res.clearCookie('fizz')
    res.send('Cookie has been deleted')
  })
  
module.exports = router;