const express = require('express');

const veterinaryController = require('../controllers/veterinaryController');

const jwtMiddleware = require('../middleware/jwtMiddleware')

const { check } = require('express-validator')

const multerConfig = require('../middleware/multerMiddleware')

const router = express.Router();

//add Doctor
router.post('/add',multerConfig.single('image'),[
    check('name').not().isEmpty(),
    check('education').not().isEmpty(),
    check('experience').not().isEmpty(),
    check('consultingDays').not().isEmpty(),
    check('consultingTime').not().isEmpty(),
    check('fee').not().isEmpty(),
    check('info').not().isEmpty(),
    check('location').not().isEmpty(),

],veterinaryController.addDoctor)

//get All Doctors
router.get('/',jwtMiddleware,veterinaryController.getAllDoctors)

//Booking Appointment
router.post('/book-appointment',jwtMiddleware,veterinaryController.bookingAppointment)

//Get Booking Appointment list by user_Id
router.get('/get-appointments',jwtMiddleware,veterinaryController.getAppointmentbyId)

//Get a Particular Appointment Details
router.get('/get-appointment/:appointmentId',jwtMiddleware,veterinaryController.getParticularAppointment)

//Get a Particular Doctor details
router.get('/:doctorId',jwtMiddleware,veterinaryController.getParticularDoctorDetails)


module.exports = router;