require('dotenv').config({ path: `${__dirname}/env.env` })
require('./src/db/mongoose')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')


const app = express()

const userRoutes = require('./src/routes/userRoutes')
const circleRoutes = require('./src/routes/circleRoutes')

app.use(helmet())
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(bodyParser.urlencoded())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth/user/', userRoutes)
app.use('/api/auth/circle/', circleRoutes)


app.listen(process.env.PORT, () => {
    console.log("Server is up!")
})