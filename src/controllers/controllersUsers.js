const { AuthService, UsersService, ContactsService } = require('../services')
const { HttpCode } = require('../helpers/constans')

const serviceAuth = new AuthService()
const serviceUser = new UsersService()
const contactsService = new ContactsService()

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
    console.log(newUser)
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
        subscription: newUser.subscription
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

const getAllContacts = async (req, res, next) => {
  try {
    const userId = req.user.id
    console.log(userId)
    const contacts = await contactsService.listContacts(userId, req.query)
    res.status(HttpCode.OK).json({
      status: 'Success',
      code: HttpCode.OK,
      data: {
        ...contacts
      }
    })
  } catch (err) {
    next(err)
  }
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

module.exports = {
  signup,
  login,
  logout,
  getAllContacts,
  updateUser,
}
