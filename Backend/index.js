const express = require('express')
const bodyParser = require('body-parser')
const dbConnect = require('./config/dbConnect')
const dotenv = require('dotenv').config()
const authRouter = require('./routes/auth-route')
const { notFound, errorHandler } = require('./middlewares/errorHandler')
const app = express()
const PORT = process.env.PORT || 4000

dbConnect()

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/user', authRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, ()=> {
  console.log(`Server is running at PORT ${PORT}`)
})

