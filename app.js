const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser') 
const cors = require('cors')
const userRouter = require('./routes/UserRoutes.js')
const adminRouter = require('./routes/AdminRoutes.js')
const User = require('./models/UserModel.js')

const app = express()
app.use(cookieParser())
app.use(cors({ origin: true, credentials: true }))
app.use(express.urlencoded({ extended: true })) 
app.use(express.json()) 
require('dotenv').config();

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
    .then(() => console.log(`Connected to the database successfully!`))
    .catch((error) => {
        console.log(`There was an error connecting to the database. ${error}`) 
    })
app.use('/api', userRouter)
app.use('/api/admin', adminRouter)


const server = app.listen(process.env.PORT||6969, () => console.log(`Server is running on the PORT: ${5000}`))