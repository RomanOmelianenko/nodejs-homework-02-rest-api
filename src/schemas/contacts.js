const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
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
  },
  password: {
    type: String,
  },
  token: {
    type: String,
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
}, { versionKey: false, timeStamps: true })

contactSchema.plugin(mongoosePaginate)

const Contact = mongoose.model('Contact', contactSchema)

module.exports = Contact
