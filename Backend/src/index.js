const express = require('express')
const bodyParser = require('body-parser')
const dbConnect = require('./config/db-connect')
const dotenv = require('dotenv').config()
const authRouter = require('./routes/auth-route')
const { notFound, errorHandler } = require('./middlewares/error-handler')
const app = express()
const PORT = process.env.PORT || 4000
const cookieParser = require('cookie-parser')
dbConnect()

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/api/user', authRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, ()=> {
  console.log(`Server is running at PORT ${PORT}`)
})
