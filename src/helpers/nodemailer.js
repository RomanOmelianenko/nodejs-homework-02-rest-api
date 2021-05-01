const nodemailer = require('nodemailer')
require('dotenv').config()

async function sendEmail(verifyToken, email, name) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    // host: 'smtp.gmail.com',
    //   port: 465,
    //   secure: true,
    auth: {
      user: process.env.EMAIL,
      password: process.env.PASSWORD
    }
  })

  const mailOptions = {
    from: 'test@gmail.com',
    to: email,
    subject: 'Verify your email',
    text: 'Send mail'
  }

  transporter.sendMail(mailOptions)
    .then((response) => {
        console.log(response[0].statusCode)
        console.log(response[0].headers)
      })
      .catch((error) => {
        console.error(error)
      })
}

module.exports = { sendEmail }