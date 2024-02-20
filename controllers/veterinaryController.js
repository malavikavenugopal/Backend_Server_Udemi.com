const HttpError = require('../models/http-error');

const { validationResult } = require('express-validator')

const doctors = require('../models/veterinarySchema')
const appointments = require('../models/appointmentSchema')


//Post Doctors
const addDoctor =  async(req,res,next)=>{

}



//get All Doctors
const getAllDoctors = async (req, res, next) => {

    try {

        const allDoctors = await doctors.find()


        if (allDoctors.length <= 0) {
            res.status(200).json({ message: "Sorry,No doctors found!" })
        }
        else {
            res.status(200).json(allDoctors)
        }

    }
    catch (err) {
        const error = new HttpError(
            'Something went wrong,Please try again later',
            500
        );
        return next(error)
        console.log(err);
    }


}

//Booking Appointment
const bookingAppointment = async (req, res,next) => {

    const owner_Id = req.payload
    const { doctor_Id, consultingDate, consultingTime } = req.body

     
    try {

        const newAppointment = new appointments({
            owner_Id,
            doctor_Id,
            consultingDate,
            consultingTime
        })

        await newAppointment.save()
        res.status(200).json(newAppointment)


    }
    catch (err) {
        const error = new HttpError(
            'Something went wrong,Please try again later',
            500
        );
        
        console.log(err);
        return next(error)
    }



}

module.exports = {
    getAllDoctors,
    bookingAppointment,
    addDoctor
}

