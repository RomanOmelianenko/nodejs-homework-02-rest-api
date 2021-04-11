const { AuthService, UsersService } = require('../services')
const { HttpCode } = require('../helpers/constans')

const serviceAuth = new AuthService()
const serviceUser = new UsersService()

const signup = async (req, res, next) => {
  const { name, email, password } = req.body
  const user = await serviceUser.findByEmail(email)
  if (user) {
    return next({
      status: HttpCode.CONFLICT,
      data: 'Conflict',
      message: 'This email is already use'
    })
  }
  try {
    const newUser = await serviceUser.create({ name, email, password })
    return res.status(HttpCode.CREATED).json({
      status: 'Success',
      message: `Contact with name: ${name} added successfully!`,
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
      }
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const token = await serviceAuth.login({ email, password })
    if (token) {
      return res.status(HttpCode.OK).json({
        status: 'Success',
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
  // console.log(id)
  await serviceAuth.logout(id)
  return res.status(HttpCode.NO_CONTENT).json({
    status: 'Success',
    code: HttpCode.NO_CONTENT,
    message: 'User logout!'
  })
}

module.exports = {
  signup,
  login,
  logout,
}
