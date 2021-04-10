const express = require('express')
const router = express.Router()
const controllersUsers = require('../../src/controllers/controllersUsers')

router.post('/signup', controllersUsers.signup)
router.post('/login', controllersUsers.login)
router.post('/logout', controllersUsers.logout)

module.exports = router
