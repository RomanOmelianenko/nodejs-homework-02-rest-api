const express = require('express')
const router = express.Router()
const controllersUsers = require('../../src/controllers/controllersUsers')
const guard = require('../../src/helpers/guard')

router.post('/signup', controllersUsers.signup)
router.post('/login', controllersUsers.login)
router.post('/logout', guard, controllersUsers.logout)

module.exports = router
