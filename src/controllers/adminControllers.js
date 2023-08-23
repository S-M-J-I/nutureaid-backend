const { User } = require("../models/User")
const Verification = require("../models/Verification")
const path = require('path')

const getAllPendingVerifications = async (req, res, next) => {
    try {
        const user_type = req.params.type
        const verifications = await Verification.find({ user_type }).lean()

        let responseVerifications = [];
        if (verifications.length > 0) {
            responseVerifications = await Promise.all(verifications.map(async (element) => {
                try {
                    const responseUser = await User.find({ uid: verifications.user }).select({ fullname: 1, email: 1, phone: 1, type: 1 }).lean()
                    return {
                        ...element,
                        ...responseUser
                    }
                } catch (err) {
                    // handle error 
                    res.status(404).send({ message: "Not Found" })
                }
            }))
        }

        res.status(200).send(responseVerifications)
    } catch (err) {
        res.status(500).send({ message: "Internal Error" })
    }
}


const getVerificationDetailsOfUser = async (req, res, next) => {
    try {
        const user_id = req.params.id
        const user = await User.findOne({ uid: user_id }).select({ fullname: 1, email: 1, phone: 1, type: 1 }).lean()
        res.status(200).send(user)
    } catch (err) {
        res.status(500).send({ message: "Internal Error" })
    }
}


const getFileByIdAndChoice = async (req, res, next) => {
    try {
        const user_id = req.params.id
        const choice = req.params.choice
        const verification = await Verification.findOne({ user: user_id, }).lean()

        const filePath = path.join(__dirname, "../../", verification[choice])
        res.sendFile(filePath, function (err) {
            if (err) {
                next(err)
            } else {
                console.log('Sent')
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Internal Error" })
    }
}


const changeVerificationStatus = async (req, res, next) => {
    try {
        const user_id = req.params.id
        const status = req.body.status
        const [_, user] = await Promise.all([Verification.findOneAndRemove({ user: user_id }), User.findOne({ uid: user_id })])

        user.is_verified = status
        user.verification_status = status ? "approved" : "rejected"

        await user.save()
        res.status(200).send({ message: status ? "Approved" : "Rejected" })
    } catch (err) {
        res.status(500).send({ message: "Internal Error" })
    }
}


module.exports = {
    getAllPendingVerifications,
    getVerificationDetailsOfUser,
    getFileByIdAndChoice,
    changeVerificationStatus
}