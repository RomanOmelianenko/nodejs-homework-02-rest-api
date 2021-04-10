const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
// eslint-disable-next-line spaced-comment
const SALT_FACTOR = 6 /*Оптимально проходов 6 - 10 */
const { Schema } = mongoose
const { Subscription } = require('../helpers/constans')

const userSchema = new Schema({
  // name: {
  //   type: String,
  //   minlength: 2,
  //   default: 'Guest',
  // },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    // eslint-disable-next-line spaced-comment
    unique: true, /*unique - должен быть уникальным */
    // validate(value) {
    //   const reg = /\S+@\S+\.\S+/
    //   return reg.test(String(value).toLowerCase())
    // }
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
  // owner: {
  //   type: mongoose.SchemaTypes.ObjectId,
  //   ref: 'user'
  // },
  // date: {
  //   type: Date,
  //   default: Date.now
  // },
}, { versionKey: false, timeStamps: true })

// -------------------------------------------------------------
// Два подхода. Можно использовать хуки или статический метод
// 1. Hook
// Перед сохранением что-то должно быть и использовать метод 'pre'
// Если поставить срелочную функцию, я потеряю контекст класса схемы userSchema
//  В стрелочной функции this не будет определён
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hashSync(this.password, bcrypt.genSaltSync(SALT_FACTOR))
  // В this.password будет уже лежать захешированый пароль
  next()
})

userSchema.path('email').validate(function (value) {
  const reg = /\S+@\S+\.\S+/
  return reg.test(String(value).toLowerCase())
})

// 2. Статический метод
userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compareSync(password, this.password)
}
// ----------------------------------------------------------

const User = mongoose.model('user', userSchema)
// 'user' - !!! должно совпадать с реферальной ссылкой из schemas/contacts/owner ref: 'user'

module.exports = User
