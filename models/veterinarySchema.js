const mongoose = require('mongoose')

const veterinarySchema = new  mongoose.Schema({

    name: {
        type: String,
        require: true
    },
    image:{
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
    location:{
        type:String,
        require:true
    }
  

})

const doctors =  mongoose.model("doctors",veterinarySchema)

module.exports  = doctors