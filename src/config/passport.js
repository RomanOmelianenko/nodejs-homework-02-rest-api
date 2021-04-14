const passport = require('passport')
const { Strategy, ExtractJwt } = require('passport-jwt')
const { UsersService } = require('../services')
require('dotenv').config()
const SECRET_KEY = process.env.JWT_SECRET_KEY

const params = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY
}

passport.use(
  new Strategy(params, async (jwtPayload, done) => {
    try {
      // console.log('🚀 ~ file: passport.js ~ line 15 ~ newStrategy ~ jwtPayload', jwtPayload)
      const service = new UsersService()
      const user = await service.findById({ _id: jwtPayload.id })
      // console.log('🚀 ~ file: passport.js ~ line 19 ~ newStrategy ~ user', user)

      if (!user) {
        return done(new Error('User not found'))
      }
      if (!user.token) {
        return (done(null, false))
      }
      return done(null, user)
    } catch (err) {
      done(err)
    }
  })
)
