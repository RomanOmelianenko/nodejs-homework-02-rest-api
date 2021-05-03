const { AuthService, UsersService } = require('../services')
const { HttpCode } = require('../helpers/constans')
const fs = require('fs').promises
const path = require('path')
const jimp = require('jimp')
require('dotenv').config()

const serviceAuth = new AuthService()
const serviceUser = new UsersService()
// const contactsService = new ContactsService()

const signup = async (req, res, next) => {
  const { name, email, password } = req.body
  const user = await serviceUser.findByEmail(email)
  if (user) {
    return next({
      status: HttpCode.CONFLICT,
      code: HttpCode.CONFLICT,
      message: 'This email is already use',
      data: 'Conflict',
    })
  }
  try {
    const newUser = await serviceUser.createUserRegistry({ name, email, password })
    // console.log(newUser)
    return res.status(HttpCode.CREATED).json({
      status: 'Success',
      message: `User with name: '${name}' added successfully!`,
      code: HttpCode.CREATED,
      data: {
        // user: newUser
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        subscription: newUser.subscription,
        avatarUrl: newUser.avatarUrl,
      }
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body
  const user = await serviceUser.findByEmail(email)
  if (!user) {
    return next({
      status: HttpCode.NOT_FOUND,
      data: 'Not found',
      message: `This email: ${email} was not found`
    })
  }
  try {
    const token = await serviceAuth.login(email, password)
    if (token) {
      return res.status(HttpCode.OK).json({
        status: 'Success',
        message: `User with email: '${email}' logged in!`,
        code: HttpCode.OK,
        data: {
          token
        }
      })
    }
    next({
      status: HttpCode.UNAUTHORIZED,
      message: 'Invalid creadentials',
    })
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  const id = req.user.id
  console.log(id)
  await serviceAuth.logout(id)
  return res.status(HttpCode.NO_CONTENT).json({
    status: 'Success',
    code: HttpCode.NO_CONTENT,
    // message: 'User logout!'
  })
}

const updateUser = async (req, res, next) => {
  try {
    const { contactId } = req.params
    const user = await serviceUser.update(contactId, req.body)
    if (user) {
      res.status(HttpCode.OK).json({
        status: 'Success',
        message: `User with id:${contactId} updated successfully!`,
        code: HttpCode.OK,
        data: {
          user
        }
      })
    }
  } catch (err) {
    next(err)
  }
}

const updateAvatars = async (req, res, next) => {
  console.log('req.file:', req.file)
  const id = req.user.id
  const pathFile = req.file.path
  const { filename } = req.file
  const img = await jimp.read(pathFile)
  await img
    .autocrop()
    .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER || jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile)
  const AVATARS_DIR = path.join(process.cwd(), process.env.AVATARS_DIR)
  await fs.rename(pathFile, path.join(AVATARS_DIR, filename))
  const pathFileTransfer = path.join(AVATARS_DIR, filename)
  try {
    const url = await serviceUser.updateCloudAvatar(id, pathFileTransfer)
    fs.unlink(pathFileTransfer)
    return res.status(HttpCode.OK).json({
      status: 'Success',
      code: HttpCode.OK,
      avatarUrl: url
    })
  } catch (err) {
    next(err)
  }
  // res.redirect('/')
}

const currentUser = async (req, res, next) => {
  try {
    const userId = req.user.id
    const user = await serviceUser.getCurrentUserById(userId)
    if (user) {
      return res.status(HttpCode.OK).json({
        status: 'Success',
        code: HttpCode.OK,
        data: {
          user
        }
      })
    } else {
      next({
        status: HttpCode.UNAUTHORIZED,
        message: 'Invalid credentials',
      })
    }
  } catch (err) {
    next(err)
  }
}

const verifyUser = async (req, res, next) => {
  try {
    // req.params - падает токен
    const { token } = req.params
    // console.log('🚀 ~ file: controllersUsers.js ~ line 160 ~ verifyUser ~ token', token)
    const result = await serviceUser.verifyUser({verifyToken: token})
    if (result) {
      return res.status(HttpCode.OK).json({
        status: 'Success',
        code: HttpCode.OK,
        data: {
          message: 'Verification successful'
        }
      })
    } else {
      return next({
        status: HttpCode.BAD_REQUEST,
        message: 'Your verification token is not valid. Contatc support',
      })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  signup,
  login,
  logout,
  updateUser,
  updateAvatars,
  currentUser,
  verifyUser,
  // avatarCloudUpdate,
}
