const sgMail = require('@sendgrid/mail')
const Mailgen = require('mailgen')
require('dotenv').config()

class EmailService {
  constructor() {
    this.sender = sgMail
    this.GenerateTemplate = Mailgen
  }

  createTemplate(verifyToken, name) {
    // mailGenetator - генерирует письмо
    const mailGenetator = new this.GenerateTemplate({
      theme: 'default',
      product: {
        name: 'System contacts',
        link: 'http://localhost:3000'
      }
    })
    const email = {
      body: {
        name: name,
        intro: 'Welcome to System Contacts! We\'re very excited to have you on board.',
        action: {
          instructions: 'To get started with System Contacts, please click here:',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: `http:localhost:3000/api/users/verify/${verifyToken}`
          }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
      }
    }
    const emailBody = mailGenetator.generate(email)
    return emailBody
  }

  async sendEmail(verifyToken, email, name) {
    const emailBody = this.createTemplate(verifyToken, name)
    // console.log('🚀 ~ file: email.js ~ line 39 ~ EmailService ~ sendEmail ~ emailBody', emailBody)

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
      to: email, // Change to your recipient
      from: 'noreply@system-contacts.com', // Change to your verified sender
      subject: 'Verify your email',
      text: 'Click to link',
      html: emailBody,
    }

    await this.sender.send(msg)
    // .then((response) => {
    //   console.log(response[0].statusCode)
    //   console.log(response[0].headers)
    // })
    // .catch((error) => {
    //   console.error(error)
    // })
  }
}

module.exports = EmailService
