const mongoose = require('mongoose');

const groomSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true
    },
    image:{
        type: String,
        require: true
    },
    info: {
        type: String,
        require: true
    },
    workingDays: {
        type: String,
        require: true
    },
    workingTime: {
        type: String,
        require: true
    },
    location: {
        type: String,
        require: true
    }


});



const grooms = mongoose.model('grooms', groomSchema);

module.exports = grooms;