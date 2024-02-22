const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    petId:{
        type: mongoose.Schema.Types.ObjectId,
      
    },
    name: {
        type: String,
        require: true
    },
    image:{
        type: String,
        require: true
    }


});



const devices = mongoose.model('devices', deviceSchema);

module.exports = devices;