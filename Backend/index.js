const env = require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()
const cors = require('cors')

const fileUpload = require('express-fileupload')
const scheduleTasks = require('./Cron/scheduler')

const port = 5000;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 10 * 1024 * 1024 }
}))

const mongoURL = process.env.MONGO_URL

// ROUTERS
const userRouter = require('./Routers/userRouter')
const locationRouter = require('./Routers/locationRouter')
const stateRouter = require('./Routers/stateRouter')
const hotelRouter = require('./Routers/hotelRouter')
const roomRouter = require('./Routers/roomRouter')
const bookingRouter = require('./Routers/bookingRouter')
const couponRouter = require('./Routers/couponRouter')

mongoose.connect(mongoURL)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err))

//  routes here
app.use('/user', userRouter)
app.use('/location', locationRouter)
app.use('/state', stateRouter)
app.use('/hotel', hotelRouter)
app.use('/room', roomRouter)
app.use('/booking', bookingRouter)
app.use('/coupon', couponRouter)


// Scheduler call
scheduleTasks()


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

