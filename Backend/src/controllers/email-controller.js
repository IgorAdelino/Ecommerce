const nodemailer = require('nodemailer')
const asyncHandler = require("express-async-handler")

const sendEmail = asyncHandler(async (data, req, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })

  let info = await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html
  })

})

module.exports = {
  sendEmail
}