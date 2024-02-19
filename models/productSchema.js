const mongoose = require('mongoose')

const productSchema = new  mongoose.Schema({

    name: {
        type: String,
        require: true
    },
    price:{
        type: Number,
        require: true
    },
    description:{
        type: String,
        require: true
    },
    category:{
        type: String,
        require: true
    },
    image:{
        type: String,
        require: true
    }
})

const products=  mongoose.model("products",productSchema)

module.exports  = products