const mongoose = require('mongoose')

const verificationSchema = mongoose.Schema({
    user: {
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
}, {
    timestamp: true
})


const Verification = mongoose.model('Verification', verificationSchema)

module.exports = Verification