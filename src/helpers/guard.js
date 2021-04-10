// Промежуточное по (middlevar), которое будет разрешать или не разрешать проход
const passport = require('passport')
require('../config/passport') /* настройки конфига */
const { HttpCode } = require('./constans')

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return next({
        status: HttpCode.FORBIDDEN,
        // code: HttpCode.FORBIDDEN,
        message: 'Forbidden'
      })
    }
    // ---------------------------------------------------------------
    req.user = user
    // res.locals.user = user - переменная на текущем запросе для текущего пользователя
    // req.app.locals.vars - глобальная переменная. На любом запросе можно её хранить
    // ------------------------------------------------------------
    return next()
  })(req, res, next)
}
module.exports = guard
