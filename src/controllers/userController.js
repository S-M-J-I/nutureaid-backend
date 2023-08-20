const { User } = require('../models/User')
const Verification = require('../models/Verification')

/**
 * Make a user entry into the database
 * @param {Any} req The json body of the user passed from the front-end
 * @param {Any} res The response object 
 * @param {Any} next Jump to next function
 * @returns {None} just a redirect
 */
const userSignup = async (req, res, next) => {
    try {
        const user = new User(req.body)

        await user.save()

        res.status(201).send({ message: "Success" })
    } catch (err) {
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

        const uid = req.body.uid
        const user = await User.findOne({ uid })


        if (!user) {
            res.status(404).send({ message: "Not Found User" })
        }


        res.status(200).send(user.cleanUser())
    } catch (err) {
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
        console.log(req.file)
        // const verification = new Verification({
        //     user: req.params.id,

        // })
        res.status(200).send({ message: "Applied for verification" })
    } catch (err) {
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
    saveVerification
}