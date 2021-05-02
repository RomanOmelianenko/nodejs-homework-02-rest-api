const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
require('dotenv').config()

async function sendEmail(verifyToken, email, name) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    // host: 'smtp.gmail.com',
    //   port: 465,
    //   secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  })

  // Middleware For Handlebars
  // transporter.use('compile', hbs({
  //   viewEngine: 'express-handlebars',
  //   viewPath: './'
  // }))

  const mailOptions = {
    from: 'test@gmail.com',
    to: email,
    subject: 'Verify your email',
    // text: 'Confirm your account',
    // html: '<button type="submit"><a href=`http:localhost:3000/api/users/verify/${verifyToken}`></a>Confirm your account</button>',
    // template: 'main',
  }

  mailOptions.html = 
    `<div style='text-align: center'>
      <h1>Hi, ${name},</h1>
      <h2 style='color: blue'>Welcome to System Contacts!</h2>
      <p style='color: blue; margin-bottom: 40px; font-size: 18px'>
        To get started with System Contacts, please click here:
      </p>
      <button type="button" style='background-color: #22BC66'>
        <a style="text-decoration: none; color: black" href=http:localhost:3000/api/users/verify/${verifyToken}>
          Confirm your account
        </a>
      </button>
    </div>`

  await transporter.sendMail(mailOptions)
    // .then((response) => {
    //     console.log(response[0].statusCode)
    //     console.log(response[0].headers)
    //   })
    //   .catch((error) => {
    //     console.error(error)
    //   })
}

module.exports = { sendEmail }