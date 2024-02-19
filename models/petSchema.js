const mongoose = require('mongoose')

const userSchema = new  mongoose.Schema({

   name: {
        type: String,
        require: true
    },
   breed:{
    type: String,
    require: true
   },
   gender:{
    type: String,
    require: true
   },
   age:{
    type: Number,
    require: true
   },
   color:{
    type: String,
    require: true
   },
   height:{
    type: Number,
    require: true
   },
   weight:{
    type: Number,
        require: true
   },
   image:{
    type: String,
    require: true
   },
   owner:{
    type: String,
    require: true
   }
})

const pets=  mongoose.model("pets",userSchema)

module.exports  = pets