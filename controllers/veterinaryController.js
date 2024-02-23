const HttpError = require('../models/http-error');

const { validationResult } = require('express-validator')
const doctors = require('../models/veterinarySchema')
const appointments = require('../models/appointmentSchema');


//Post Doctors
const addDoctor = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { name, education, experience, consultingDays, consultingTime, fee, info, location } = req.body
    try {

        const newDoctor = new doctors({
            name,
            image: req.file.filename,
            education,
            experience,
            consultingDays,
            consultingTime,
            fee,
            info,
            location

        });

        await newDoctor.save();
        res.status(201).json({status:true,message:"Successfully added",data:newDoctor});
    }
    catch (err) {
        console.log(err);
        const error = new HttpError(
            'Something went wrong,Please try again later',
            500
        );
        return next(error)

    }

}



//get All Doctors
const getAllDoctors = async (req, res, next) => {

    try {

        const allDoctors = await doctors.find()


        if (allDoctors.length <= 0) {
            res.status(200).json({ message: "Sorry,No doctors found!" })
        }
        else {
            res.status(200).json({status:true , dataFound:true,data:allDoctors})
        }

    }
    catch (err) {
        console.log(err);
        const error = new HttpError(
            'Something went wrong,Please try again later',
            500
        );
        return next(error)

    }


}

//Booking Appointment
const bookingAppointment = async (req, res, next) => {
    const owner_Id = req.payload;
    const { doctor_Id, consultingDate, consultingTime } = req.body;

    try {

        const existingBooking = await appointments.findOne({ consultingDate, consultingTime });
        if (existingBooking) {
            return res.status(400).json({ message: 'Selected time  is not available, please choose another time.' });
        }


        const newAppointment = new appointments({
            owner_Id,
            doctor_Id,
            consultingDate,
            consultingTime
        });

        await newAppointment.save();
        res.status(201).json({status:true,message:"Appointment booked",newAppointment});


    } catch (err) {
        console.error(err);
        const error = new HttpError('Something went wrong, please try again later', 500);
        return next(error);
    }
};

//Get all Booking Appointment list by user_Id
const getAppointmentbyId = async (req, res, next) => {

    const owner_Id = req.payload

    try {
        const appointmentList = await appointments.find({ owner_Id })
        res.status(200).json({status:true ,dataFound:true,data :appointmentList})

    }
    catch (err) {
        console.error(err);
        const error = new HttpError('Something went wrong, please try again later', 500);
        return next(error);
    }

}


//Get a Particular Appointment Details
const getParticularAppointment = async (req, res, next) => {
    const id = req.params.id

    try {
        const appointmentList = await appointments.findOne({ _id: id })

        const doctor_Id = appointmentList.doctor_Id
        const doctor = await doctors.findOne({ _id: doctor_Id })
        res.status(200).json({
            status:true,data :{
            Appointment_Id: appointmentList._id,
            Doctor_Name: doctor.name,
            consultingDate: appointmentList.consultingDate,
            consultingTime: appointmentList.consultingTime
            }
        })

    }
    catch (err) {
        console.error(err);
        const error = new HttpError('Something went wrong, please try again later', 500);
        return next(error);
    }

}
//get a particular doctor details
const  getParticularDoctorDetails =  async(req,res,next)=>{

const id = req.params.id

try{
 const doctor = await doctors.findById(id)
 res.status(200).json({status:true,dataFound:true,data:doctor})
}
catch (err) {
    console.error(err);
    const error = new HttpError('Something went wrong, please try again later', 500);
    return next(error);
}


}
module.exports = {
    addDoctor,
    getAllDoctors,
    bookingAppointment,
    addDoctor,
    getAppointmentbyId,
    getParticularAppointment,
    getParticularDoctorDetails
}

