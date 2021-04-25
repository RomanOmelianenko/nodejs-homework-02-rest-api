const User = require('../schemas/user')
const cloudinary = require('cloudinary').v2
require('dotenv').config()

class UserService {
  constructor() {
    this.model = User
    this.cloudinary = cloudinary
    this.cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    })
  }

  async uploadCloud(pathFileTransfer) {
    // console.log('pathFile:', pathFile)
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line spaced-comment
      this.cloudinary.uploader.upload(pathFileTransfer, {
        folder: 'avatars',
        transformation: {
          width: 250, crop: 'fill'
        }
      },
      (error, result) => {
        console.log('result:', result)
        if (error) reject(error)
        if (result) resolve(result)
      })
    })
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

  async updateCloudAvatar(id, pathFileTransfer) {
    try {
      const {
        secure_url: avatarUrl,
        public_id: idCloudAvatar
      } = await this.uploadCloud(pathFileTransfer)
      const oldAvatar = await this.model.findOne({ _id: id })
      this.cloudinary.uploader.destroy(oldAvatar.idCloudAvatar, (err, result) => {
        console.log(err, result)
      })
      await this.model.updateOne({ _id: id }, { avatarUrl, idCloudAvatar })
      return avatarUrl
    } catch (err) {
      // throw new ErrorHandler(null, 'Error upload avatar')
      console.log(err)
    }
  }
}

module.exports = UserService
