const mongoose = require("mongoose")

const reviewSchema = mongoose.Schema({
    given_to: { type: String },
    given_by: { type: String },
    behavior: { type: Number },
    timely: { type: Number },
    skilled: { type: Number },
    rating: { type: Number },
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review