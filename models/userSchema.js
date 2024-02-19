const mongoose = require('mongoose')

const userSchema = new  mongoose.Schema({

   name: {
        type: String,
        require: true
    },
   email: {
        type: String,
        require: true,
        unique:true
    },
   password: {
        type: String,
        require: true,
        minlength:6
    },
    address:{
        type: String,
        require: true
    }
})

const users=  mongoose.model("users",userSchema)

module.exports  = users