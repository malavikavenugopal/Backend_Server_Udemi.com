const mongoose = require('mongoose')

const appointmentSchema = new  mongoose.Schema({

   doctor_Id: {
        type: String,
        require: true
    },
    owner_Id:{
        type: String,
        require: true
    },
    consultingDate:{
        type: String,
        require: true
    },
    consultingTime:{
        type: String,
        require: true
    }
},{
    timestamps: {
    }
})

const appointments =  mongoose.model("appointments",appointmentSchema)

module.exports  = appointments