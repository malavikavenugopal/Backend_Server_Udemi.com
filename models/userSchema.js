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
   image: {
        type: String,
        require: true
    },
    places:
    //one user can add multiple places
    [{
        type: mongoose.Types.ObjectId,
        require: true,
        ref:"placeSchema"
    }]
})

const users=  mongoose.model("users",userSchema)

module.exports  = users