const { User } = require("../models/User")
const Verification = require("../models/Verification")
const path = require('path')
const { makeImgToBuffer64, makePdfToBinary } = require("./utils")

const getAllPendingVerifications = async (req, res, next) => {
    try {
        const user_type = req.params.type
        const verifications = await Verification.find({ user_type, status: "pending" }).lean()

        let responseVerifications = [];
        if (verifications.length > 0) {
            await Promise.all(verifications.map(async (element) => {
                try {
                    const responseUser = await User.findOne({ uid: element.user }).select({ fullname: 1, email: 1, phone: 1, type: 1 }).lean()
                    // console.log(responseUser)
                    const file_path_1 = makeImgToBuffer64(element.file_path_1)
                    const file_path_2 = makeImgToBuffer64(element.file_path_2)

                    element.file_path_1 = file_path_1
                    element.file_path_2 = file_path_2

                    if (element.resume_path) {
                        const resume_bin = makeImgToBuffer64(element.resume_path)
                        element.resume_path = resume_bin
                    }

                    const body = {
                        ...element,
                        ...responseUser
                    }
                    // console.log(body)
                    responseVerifications.push(body)
                    return element
                } catch (err) {
                    // handle error 
                    // res.status(404).send({ message: "Not Found" })
                    // return
                }
            }))
        }

        res.status(200).send(responseVerifications)
    } catch (err) {
        console.log(err)
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
        // const user = await User.findOne({ uid: user_id })
        const [verification, user] = await Promise.all([Verification.findOne({ user: user_id }), User.findOne({ uid: user_id })])

        // console.log(user)
        user.is_verified = status
        user.verification_status = status ? "approved" : "none"

        verification.status = status ? "approved" : "rejected"

        await Promise.all([user.save(), verification.save()])
        res.status(200).send({ message: status ? "Approved" : "Rejected" })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Internal Error" })
    }
}


module.exports = {
    getAllPendingVerifications,
    getVerificationDetailsOfUser,
    getFileByIdAndChoice,
    changeVerificationStatus
}