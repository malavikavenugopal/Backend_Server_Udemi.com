const HttpError = require('../models/http-error');

const { validationResult } = require('express-validator')

const devices = require('../models/deviceSchema')


//adding pet device
const postingPetDevice = async (req, res, next) => {
    const userId = req.payload
    console.log(userId)
    const { petId, name, image } = req.body

    try {

        const newDevice = new devices({
            userId,
            petId,
            name,
            image
        });

        await newDevice.save();


        res.status(201).json({ status: true, message: 'Pet device added successfully', data: newDevice });
    }
    catch (err) {
        console.error('Error creating pet device:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }



}
//getting pet devices by userId
const getAllPetDevicesbyUserId = async (req, res, next) => {
    const userId = req.payload
    try {
        const petDevices = await devices.find({ userId });


        if (petDevices.length === 0) {
            res.status(404).json({ message: 'No pet devices found for the specified user' });
        }


        res.status(200).json({ status: true, dataFound: true, data: petDevices });
    }
    catch (err) {
        console.error('Error fetching pet devices by userId:', err);
        res.status(500).json({ message: 'Internal Server Error' });

    }
}

//get a particular pet devices
const getAPetDevice = async (req, res, next) => {

    const deviceId = req.params.id
    try {

        const petDevice = await devices.findById(deviceId);

        if (!petDevice) {
            return res.status(404).json({ message: 'Pet device not found' });
        }


        res.status(200).json({ status: true, dataFound: true, data: petDevice });
    }
    catch (err) {
        console.error('Error fetching pet device by ID:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}



module.exports = {
    postingPetDevice,
    getAllPetDevicesbyUserId,
    getAPetDevice
}
