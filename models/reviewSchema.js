const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },    
    user: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String
    }
})

const reviews = mongoose.model("reviews", reviewSchema)

module.exports = reviews