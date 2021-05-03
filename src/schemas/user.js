const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const { Schema } = mongoose
const { Subscription } = require('../helpers/constans')

const SALT_FACTOR = 6

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: 2,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: {
      values: [Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS],
      message: 'There is no such subscription',
    },
    default: Subscription.STARTER,
  },
  token: {
    type: String,
    default: null,
  },
  // Авто генерация аватара
  avatarUrl: {
    type: String,
    default: function () {
      return gravatar.url(this.email, { s: '250' }, true)
    },
  },
  idCloudAvatar: {
    type: String,
    default: null,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
    required: [true, 'Verify token is required!']
  },
}, { versionKey: false, timeStamps: true })

userSchema.path('email').validate(function (value) {
  const reg = /\S+@\S+\.\S+/
  return reg.test(String(value).toLowerCase())
})

userSchema.methods.setPassword = async function (password) {
  this.password = await bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_FACTOR))
}

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compareSync(password, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User
