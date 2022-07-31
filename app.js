require('express-async-errors')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./routes/blogRouter')
const authRouter = require('./routes/authRoutes')
const middleware = require('./utils/middleware')
const config = require('./utils/config')

mongoose.connect(config.MONGODB_URI)


app.use(cors())
app.use(express.json())
app.use(middleware.getTokenFromRequest)
app.use('/api/blogs', middleware.getUserFromToken, blogRouter)
app.use('/api/users', authRouter)
app.use(middleware.errorHandler)
module.exports = app