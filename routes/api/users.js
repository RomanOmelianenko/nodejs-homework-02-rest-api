const express = require('express')
const router = express.Router()
const controllersUsers = require('../../src/controllers/controllersUsers')
const guard = require('../../src/helpers/guard')
const upload = require('../../src/helpers/multer')

router.get('/current', guard, controllersUsers.currentUser)
router.get('/verify/:verifyToken', controllersUsers.verifyUser)
router.post('/signup', controllersUsers.signup)
router.post('/login', controllersUsers.login)
router.post('/logout', guard, controllersUsers.logout)
router.patch('/:contactId', guard, controllersUsers.updateUser)
router.patch('/avatars', guard, upload.single('avatar'), controllersUsers.updateAvatars)

module.exports = router
