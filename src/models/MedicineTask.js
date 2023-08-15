const mongoose = require('mongoose')

const MedicineTaskSchema = mongoose.Schema({
    date: {
        type: Date,
    },
    is_done: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        trim: true,
    },
    time: {
        type: String,
        trim: true,
    },
    completedAt: {
        type: Date,
    },
    given_to: {
        type: String,
    }
}, { timestamps: true })


const MedicineTask = mongoose.model('MedicineTask', MedicineTaskSchema)

module.exports = MedicineTask