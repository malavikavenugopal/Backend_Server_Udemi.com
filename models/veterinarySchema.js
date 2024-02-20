const mongoose = require('mongoose')

const veterinarySchema = new  mongoose.Schema({

    name: {
        type: String,
        require: true
    },
    education:{
        type: String,
        require: true
    },
    experience:{
        type: String,
        require: true
    },
    consultingDays:{
        type: String,
        require: true
    },
    consultingTime:{
        type: String,
        require: true
    },
    fee:{
        type: Number,
        require: true
    },
    info:{
        type: String,
        require: true
    },
    reviews:{
        type: Array,
        require: true,
        default: []
    },
    location:{
        type:String,
        require:true
    }
  

})

const doctors =  mongoose.model("doctors",veterinarySchema)

module.exports  = doctors