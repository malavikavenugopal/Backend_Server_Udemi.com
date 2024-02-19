const express = require('express');

const petController = require('../controllers/petController');
const multerConfig = require('../middleware/multerMiddleware')
const jwtMiddleware = require('../middleware/jwtMiddleware')

const { check } = require('express-validator')

const router = express.Router();

//Posting pets
router.post('/add', jwtMiddleware, multerConfig.single('image'), [
    check('name').not().isEmpty(),
    check('breed').not().isEmpty(),
    check('gender').not().isEmpty(),
    check('age').not().isEmpty(),
    check('height').not().isEmpty(),
    check('weight').not().isEmpty(),
    check('color').not().isEmpty(),
    check('info').not().isEmpty()
], petController.postPets)

//get pets by owner id
router.get('/',jwtMiddleware,petController.getPetsbyId)

//edit pet info
router.patch('/edit/:id',jwtMiddleware,petController.editPet)

//delete pet
router.delete('/delete/:id',petController.deletePet)

module.exports = router;