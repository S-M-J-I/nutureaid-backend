require('dotenv').config({ path: `${__dirname}/env.env` })
require('./src/db/mongoose')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const body_parser = require('body-parser')


const app = express()

const user_routes = require('./src/routes/auth/userAuthRoutes')
const nurse_routes = require('./src/routes/auth/nurseRoutes')
// const circle_routes = require('./src/routes/auth/circleAuthRoutes')

app.use(helmet())
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: true }))


// * AUTH SERVICE ROUTES
app.use('/api/auth/user/', user_routes)
app.use('/api/auth/nurse/', nurse_routes)
// app.use('/api/auth/circle/', circle_routes)

app.use('*', (req, res, next) => {
    res.status(404).send({ message: "Not Found" })
})

app.listen(process.env.PORT, () => {
    console.log("Server is up!", process.env.PORT)
})