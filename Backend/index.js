const env = require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const port = 5000;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const mongoURL = process.env.MONGO_URL

// ROUTERS
const userRouter = require('./Routers/userRouter')
const locationRouter = require('./Routers/locationRouter')
const stateRouter = require('./Routers/stateRouter')
const hotelRouter = require('./Routers/hotelRouter')
const roomRouter = require('./Routers/roomRouter')


mongoose.connect(mongoURL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

// Add your routes here
app.use('/user', userRouter)
app.use('/location', locationRouter)
app.use('/state', stateRouter)
app.use('/hotel', hotelRouter)
app.use('/room', roomRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})