// const { UsersRepository } = require('../repository/users')
const User = require('../schemas/user')

class UserService {
  constructor() {
    // process.nextTick(async () => {
    //   const user = await User
    this.model = User
    // })
    // this.repositories = {
    //   users: new UsersRepository()
    // }
  }

  async create(body) {
    const user = await this.model(body)
    console.log(user)
    return user.save()
  }

  async findByEmail(email) {
    const userByEmail = await this.model.findOne({ email })
    console.log(userByEmail)
    return userByEmail
  }

  async findById(contactId) {
    const userById = await this.model.findOne({ _id: contactId })
    console.log(userById)
    return userById
  }

  async updateToken(id, token) {
    await this.model.updateOne({ _id: id }, { token })
  }
}

module.exports = UserService
