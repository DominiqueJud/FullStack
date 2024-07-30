const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const logger=require('./utils/logger')
const mongoose = require('mongoose')
const config=require('./utils/config')

const Blog = require('./models/blogs')
const blogRouter = require('./controllers/blogRouter')
const User=require('./models/users')
const userRouter = require('./controllers/userRouter')
const loginRouter=require('./controllers/loginRouter')
const {errorHandler, unknownEndpoint, tokenExtractor, userExtractor}=require('./utils/middleware')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)
app.use(cors())
app.use(express.json())
app.use(tokenExtractor)
app.use(userExtractor)
app.use('/api/blogs',blogRouter)
app.use('/api/users',userRouter)
app.use('/api/login',loginRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports= app