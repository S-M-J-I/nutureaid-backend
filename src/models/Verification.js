const mongoose = require('mongoose')

const verificationSchema = mongoose.Schema({
    user: {
        type: String,
        trim: true
    },
    user_type: {
        type: String,
        trim: true
    },
    file_path_1: {
        type: String,
        trim: true
    },
    file_path_2: {
        type: String,
        trim: true
    },
    resume_path: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        trim: true,
        default: "pending"
    }
}, {
    timestamp: true
})


const Verification = mongoose.model('Verification', verificationSchema)

module.exports = Verification