const User = require('../schemas/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const SECRET_KEY = process.env.JWT_SECRET_KEY

class AuthService {
  constructor() {
    this.model = User
  }

  async login(password, email) {
    const user = await this.model.findOne(email)
    console.log(user.password)
    if (!user || !user.validPassword(password)) {
      return null
    }
    const id = user._id
    const payload = { id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
    const verifyToken = jwt.verify(token, SECRET_KEY)
    if (verifyToken) {
      await this.model.updateOne({ _id: id }, { token })
    }
    console.log(user)
    return token
  }

  async logout(id) {
    const data = await this.model.updateOne({ _id: id, token: null })
    return data
  }
}

module.exports = AuthService
