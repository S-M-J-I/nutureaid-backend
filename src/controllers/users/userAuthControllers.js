const { User } = require('../../models/User')

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
        res.status(200).send({ message: "success" })
    } catch (err) {
        res.status(500).send({ message: "internal error" })
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

        user.tokens = user.tokens.concat({ token })
        req.headers.authorization = 'Bearer ' + token
        await user.save()

        res.status(200).send({ message: "success" })
    } catch (err) {
        res.status(500).send({ message: "internal error" })
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


        user.tokens = user.tokens.filter((token) => auth_token !== token.token)

        res.removeHeader('authorization')

        await user.save()

        res.status(200).send({ message: "success" })
    } catch (err) {
        res.status(500).send({ message: "internal error" })
    }
}

module.exports = {
    userSignup,
    userLogin,
    userLogout
}