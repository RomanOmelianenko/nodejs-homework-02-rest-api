const mongoose = require('mongoose')
const { Schema } = mongoose

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name contact is required'],
  },
  email: {
    type: String,
    required: [true, 'Email contact is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone contact is required'],
  },
  subscription: {
    type: String,
    // required: [true, 'Phone contact is required'],
  },
  password: {
    type: String,
    // required: [true, 'Phone contact is required'],
  },
  token: {
    type: String,
    // required: [true, 'Phone contact is required'],
  }
  // features: {
  //   type: Array,
  //   set: data => !data ? [] : data
  // }
  // date: { type: Date, default: Date.now },
}, { versionKey: false, timeStamps: true })

const Contact = mongoose.model('Contact', contactSchema)

module.exports = Contact
