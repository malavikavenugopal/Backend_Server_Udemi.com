const express = require('express')

const HttpError = require('../models/http-error');
const { check } = require('express-validator')
const multerMiddleware = require('../middleware/multerMiddleware');
const jwtMiddleware = require('../middleware/jwtMiddleware')
const router = express.Router();
const placeController = require('../controllers/placeController')
router.get('/get', (req, res, next) => {
    console.log('GET Request in Places');
    res.send(
        '<form action="/user" method="POST"><input type="text" name="name"><button type="submit">Create User</button></form>'
    );
})

router.post('/user', (req, res) => {
    res.send('<h1> User: ' + req.body.name + '</h1>')
})
router.get('/', (req, res, next) => {
    console.log('GET Request in Places');
    res.json({ message: 'It works!' });
});



const DUMMY_PLACES = [
    {
        id: '1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        location: {
            lat: 40.7484474,
            lng: -73.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: '1'
    },
     {
        id: '2',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        location: {
            lat: 46.7484474,
            lng: -79.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: '1'
    }
];

router.get('/place/:id', (req, res) => {


    const id = req.params.id

    const place = DUMMY_PLACES.find((places) => {

        return places.id == id;
    })
    if (!place) {
      /*   return res.status(404).json({ message: "couldn't find a place with provided id" }) */
      const error = new Error('Could not find a place for the provided id.');
      error.code = 404;
      throw error;

    }
    res.json({ place })
})

router.get('/user/:id', (req, res,next) => {
    const id = req.params.id
    const places = DUMMY_PLACES.filter((places) => {
        return places.creator == id;
    })

    if (!places || places.length ===0) {
     
       //HttpError(message: any, errorCode: any): HttpError
       throw new HttpError ('Could not find a place for the provided user id.', 404)
      
      }

    res.json({ places })
})

//updating
router.patch('/update/:id',
[
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty()
],
placeController.updatePlace)

//deleting 
router.delete("/delete/:pid",placeController.deletePlace)


router.post('/addplace',jwtMiddleware,multerMiddleware.single('image'),
[
  check('title')
    .not()
    .isEmpty(),
  check('description').isLength({ min: 5 }),
  check('address')
    .not()
    .isEmpty()
],placeController.addPlace)

router.get('/getplace/:id',placeController.getplacebyid)

router.patch('/updateplace/:id',jwtMiddleware,placeController.updateplacebyid)

router.delete('/deleteplace/:id',jwtMiddleware,placeController.deleteplacebyid)

module.exports = router;