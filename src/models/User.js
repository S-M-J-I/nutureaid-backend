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
        blood_group: { type: String, trim: true },
        gender: { type: String, trim: true },
        phone: { type: String, trim: true },
        address: { type: String, trim: true },
        rewards: { type: Number, default: 0.00, },
        avatar: { type: String, trim: true, },
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
    tokens: [{
        token: { type: String, required: true, trim: true }
    }]
}, { timestamps: true })

UserSchema.methods.toJSON = function () {
    const user = this

    const userObject = user.toObject()

    // delete user elements that can't be sent to front end
    delete userObject.password

    return userObject
}

UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error({ message: "Unable to log in. Account does not exists!" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error({ message: "Unable to log in. Invalid email or password!" })
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


const NurseSchema = new AbstractEntitySchema({
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
    tokens: [{
        token: { type: String, required: true }
    }]
}, { timestamps: true })







// * ALL THE SCHEMAS
const User = mongoose.model('User', UserSchema)

module.exports = { User }