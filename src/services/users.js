const User = require('../schemas/user')
const EmailService = require('./email')
const { ErrorHandler } = require('../helpers/errorHandler')
const cloudinary = require('cloudinary').v2
const { nanoid } = require('nanoid')
require('dotenv').config()

class UserService {
  constructor() {
    this.model = User
    this.emailService = new EmailService()
    this.cloudinary = cloudinary
    this.cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    })
  }

  async createUserRegistry(body) {
    const verifyToken = nanoid()
    const { email, name } = body
    // send email - сдесь надо отправить письмо на почту
    try {
      await this.emailService.sendEmail(verifyToken, email, name)
    } catch (err) {
      throw new ErrorHandler(503, err.message, 'Service Unavailable')
      // console.log(err)
    }
    const user = await this.model({ ...body, verifyToken })
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

  async getCurrentUserById(userId) {
    const currentUser = await this.model.findOne(
      { _id: userId },
      '_id name email subscription token avatarUrl')
    return currentUser
  }

  async verifyUser(token) {
    const user = await this.model({ verifyToken: token })
    if (!user) {
      await user.updateOne({ verify: true, verifyToken: null })
      return true
    }
    return false
  }

  async uploadCloud(pathFileTransfer) {
    return new Promise((resolve, reject) => {
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
}

module.exports = UserService
