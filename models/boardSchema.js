const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({

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



const boards = mongoose.model('boards', boardSchema);

module.exports = boards;