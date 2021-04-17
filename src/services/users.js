const User = require('../schemas/user')

class UserService {
  constructor() {
    this.model = User
  }

  async createUserRegistry(body) {
    const user = await this.model(body)
    user.setPassword(body.password)
    const userSaveInDB = user.save()
    return userSaveInDB
  }

  async findByEmail(email) {
    const userByEmail = await this.model.findOne({ email })
    return userByEmail
  }

  async findById(contactId) {
    const userById = await this.model.findOne({ _id: contactId })
    console.log(userById)
    return userById
  }

  async update(contactId, body) {
    const contact = await this.model.findByIdAndUpdate(
      { _id: contactId },
      { ...body },
      { new: true },
    )
    return contact
  }
}

module.exports = UserService
