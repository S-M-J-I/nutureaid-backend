const mongoose = require('mongoose')
const { User } = require('./User')
const { generateCode } = require('../functions/utils')

const CircleSchema = mongoose.Schema({
    circle_owner: {
        type: String,
        required: true,
        trim: true,
    },
    circle_members: [{
        type: String,
        trime: true
    }],
    circle_code: {
        type: String,
        trim: true
    },
    circle_link: {
        type: String,
        trim: true
    }
})

// hash password before saving
CircleSchema.pre('save', async function (next) {
    const circle = this

    circle.circle_code = generateCode()

    circle.circle_link = `http://localhost:3000/api/auth/circle/join/${circle._id}`

    next()
})

const Circle = mongoose.model('Circle', CircleSchema)

module.exports = Circle