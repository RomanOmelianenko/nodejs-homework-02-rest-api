const User = require('../schemas/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const SECRET_KEY = process.env.JWT_SECRET_KEY

class AuthService {
  constructor() {
    this.model = User
  }

  async updateToken(id, token) {
    await this.model.updateOne({ _id: id }, { token })
  }

  async login(email, password) {
    const user = await this.model.findOne({ email })
    const passwordIsValid = await user.validPassword(password)
    if (!user || !passwordIsValid) {
      return
    }
    const id = user.id
    const payload = { id }
    const token = await jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
    const verifyToken = jwt.verify(token, SECRET_KEY)
    if (verifyToken) {
      await this.updateToken(id, token)
    }
    return token
  }

  async logout(id) {
    const data = await this.updateToken(id, null)
    return data
  }
}

module.exports = AuthService
