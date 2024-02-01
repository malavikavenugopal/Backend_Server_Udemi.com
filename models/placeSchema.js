const mongoose = require('mongoose')

const placeSchema = new  mongoose.Schema({

    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    location: {
        lat: {
            type: String,
            require: true
        },
        lng: {
            type: String,
            require: true
        }
    },
    creator: {
        type :mongoose.Types.ObjectId, //mongoose.Types.ObjectId is a type that represents the BSON ObjectId value itself.
        require: true,
        ref:"userSchema" //connecting establish between place and userschema
    }
})


const places=  mongoose.model("places",placeSchema)

module.exports  = places