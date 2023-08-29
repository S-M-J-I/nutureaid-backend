const mongoose = require('mongoose')

const activitySchema = mongoose.Schema({
    label: { type: String, trim: true },
    checked: { type: Boolean, default: false },
    user: { type: String, trim: true }
})

const Activity = mongoose.model("Activity", activitySchema)

module.exports = Activity