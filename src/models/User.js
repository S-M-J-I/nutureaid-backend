const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
var Schema = mongoose.Schema
const util = require('util')

function AbstractEntitySchema() {
    Schema.apply(this, arguments);
    //add                                     
    this.add({
        entityName: { type: String, required: false },
        timestamp: { type: Date, default: Date.now },
        index: { type: Number, required: false },
        objectID: { type: String },
        id: { type: String },
        uid: { type: String, trim: true, unique: true, },
        fullname: { type: String, trim: true, unique: true, required: true, },
        biography: { type: String, trim: true, },
        type: { type: String, trim: true, default: "unset" },
        blood_group: { type: String, trim: true, },
        age: { type: Number, default: 0, },
        gender: { type: String, trim: true },
        phone: { type: String, trim: true },
        address: { type: String, trim: true },
        rewards: { type: Number, default: 0.00, },
        avatar: { type: String, trim: true, },
        rating: { type: Number, default: 0.00 },
        ongoingAppointment: { type: Boolean, default: false },
        ongoingAppointmentID: { type: String, trim: true, default: "none" },
        onboarding: { type: Boolean, default: true },
        ongoingAppointmentStatus: { type: String, default: "none" }
    });
};
util.inherits(AbstractEntitySchema, Schema);

const UserSchema = new AbstractEntitySchema({
    email: { type: String, trim: true, unique: [true, "Email must be unique"], required: true, },
    password: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        minlenght: 7,
        validate(value) {
            if (value.length < 6) {
                throw new Error("Password is less than 7 characters!")
            }
        }
    },
    is_verified: { type: Boolean, default: false },
    verification_status: { type: String, default: "pending" }, // pending => ongoing => rejected / accepted
    specialities: [{
        type: String,
        trim: true
    }],
    tokens: [{
        token: { type: String, trim: true }
    }],
    in_circle: { type: Boolean, default: false },
    circleId: { type: String, default: "none", trim: true }
}, { timestamps: true })

UserSchema.methods.cleanUser = function (exclusions = []) {
    const user = this

    const userObject = user.toObject()

    // delete user elements that can't be sent to front end
    delete userObject.password
    delete userObject.createdAt
    delete userObject.updatedAt
    delete userObject.timestamp
    delete userObject.tokens
    delete userObject.__V

    if (userObject.type === "user") {
        delete userObject.specialities
    }

    if (exclusions.length === 0) {
        return userObject
    }

    for (let param of exclusions) {
        delete userObject[param]
    }

    return userObject
}



UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error({ message: "Unable to log in. Account does not exists!" })
    }


    return user
}

// hash password before saving
UserSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// * ALL THE SCHEMAS
const User = mongoose.model('User', UserSchema)
module.exports = { User }