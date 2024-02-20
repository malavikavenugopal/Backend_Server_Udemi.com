const express = require('express');

const veterinaryController = require('../controllers/veterinaryController');

const jwtMiddleware = require('../middleware/jwtMiddleware')
const { check } = require('express-validator')

const router = express.Router();

//get All Doctors
router.get('/',jwtMiddleware,veterinaryController.getAllDoctors)

//Booking Appointment
router.post('/book-appointment',jwtMiddleware,veterinaryController.bookingAppointment)

module.exports = router;