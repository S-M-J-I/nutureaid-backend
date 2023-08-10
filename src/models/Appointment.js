const mongoose = require('mongoose')

const AppointmentSchema = mongoose.Schema({
    booked_by: {
        type: String,
        trim: true,
        required: true
    },
    booked_nurse: {
        type: String,
        trim: true,
        required: true
    },
    start_date: {
        type: Date,
    },
    end_date: {
        type: Date,
    },
    working_hours: {
        type: Number,
        required: true,
    },
    working_days: {
        type: Number,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
        default: 0
    },
    approved: {
        type: Boolean,
        default: false
    },
    rejected: {
        type: Boolean,
        default: false
    },
    ongoing: {
        type: Boolean,
        default: false,
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


const Appointment = mongoose.model('Appointment', AppointmentSchema)

module.exports = Appointment