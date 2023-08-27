const { User } = require('../models/User')
const Verification = require('../models/Verification')
const sharp = require('sharp')
const fs = require('fs')
const { makeImgToBuffer64 } = require('./utils')
const path = require('path')

/**
 * Make a user entry into the database
 * @param {Any} req The json body of the user passed from the front-end
 * @param {Any} res The response object 
 * @param {Any} next Jump to next function
 * @returns {None} just a redirect
 */
const userSignup = async (req, res, next) => {
    try {
        const user = await User.create(req.body)

        // console.log(user)

        // await user.save()

        res.status(201).send({ message: "Success" })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Internal Error" })
    }
}


/**
 * Make a user entry into the database
 * @param {Any} req The json body of the user passed from the front-end
 * @param {Any} res The response object 
 * @param {Any} next Jump to next function
 * @returns {None} just a redirect
 */
const userLogin = async (req, res, next) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = req.body.token

        if (!user) {
            res.status(404).send({ message: "User not found" })
        }

        if (user.tokens.length > 0) {
            user.tokens = []
        }

        user.tokens = user.tokens.concat({ token })
        await user.save()

        req.headers.authorization = 'Bearer ' + token

        // console.log(user)

        res.status(200).send(user.cleanUser())

    } catch (err) {
        res.status(500).send(err)
    }
}


const setAccountDetail = async (req, res, next) => {
    try {
        const user = await User.findOne({ uid: req.body.uid })
        const key = req.body.key

        user[key] = req.body[key]

        await user.save()

        res.status(200).send(user.cleanUser())
    } catch (err) {
        res.status(500).send(err)
    }
}

/**
 * Logout a user
 * @param {Any} req The json body of the user passed from the front-end
 * @param {Any} res The response object 
 * @param {Any} next Jump to next function
 * @returns {None} just a redirect
 */
const userLogout = async (req, res, next) => {
    try {

        const user = await User.findOne({ uid: req.body.uid })
        const auth_token = req.headers['authorization'].split(" ")[1]

        if (!user) {
            res.status(404).send({ message: "User not found" })
            return
        }

        user.tokens = []

        res.removeHeader('authorization')

        await user.save()

        res.status(200).send({ message: "success" })
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}


const fetchUserDetailsApiMethod = async (req, res, next) => {
    try {

        const uid = req.params.id
        const user = await User.findOne({ uid })


        if (!user) {
            res.status(404).send({ message: "Not Found User" })
        }

        if (user.avatar) {
            const avatar_buffer = makeImgToBuffer64(user.avatar)
            user.avatar = avatar_buffer
        }

        res.status(200).send(user.cleanUser())
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Internal Server Error" })
    }
}


const getUserDetails = async (uid, type, exclusions = []) => {
    try {

        const user = (type === "none") ? await User.findOne({ uid }).select() : await User.findOne({ uid, type })

        if (!user) {
            res.status(404).send({ message: "Not Found user details" })
        }


        // console.log(user)
        return user.cleanUser(exclusions)
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}


const saveVerification = async (req, res, next) => {
    try {
        const user_id = req.params.id
        const user = await User.findOne({ uid: user_id }).select({ verification_status: 1, type: 1 })

        console.log(req.files)
        const file_path_1 = req.files[0].path
        const file_path_2 = req.files[1].path
        let resume_path = undefined
        if (user.type === "nurse" && req.files[2].path) {
            resume_path = req.files[2].path
        }

        const verification = new Verification({
            user: user_id,
            user_type: user.type,
            file_path_1,
            file_path_2,
        })

        if (resume_path) {
            verification.resume_path = resume_path
        }

        user.verification_status = "ongoing"

        await Promise.all([verification.save(), user.save()])

        res.status(200).send({ message: "Applied for verification" })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Internal Error" })
    }
}


const uploadAvatar = async (req, res, next) => {
    try {
        const user_id = req.params.id

        const originalFilePath = req.file.path
        let path = req.file.path.split("\\")
        let filename = path.pop()
        path = path.join("\\")
        const composed_path = `${path}\\cropped-${filename}.jpeg`

        const file = await sharp(req.file.path).resize({ width: 300, height: 300 }).toFormat("jpeg", { mozjpeg: true }).toFile(composed_path)

        fs.unlinkSync(originalFilePath)

        await User.findOneAndUpdate({ uid: user_id }, { avatar: composed_path })

        res.status(200).send({ message: "Saved" })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Internal Error" })
    }
}



module.exports = {
    userSignup,
    userLogin,
    setAccountDetail,
    userLogout,
    getUserDetails,
    fetchUserDetailsApiMethod,
    saveVerification,
    uploadAvatar
}