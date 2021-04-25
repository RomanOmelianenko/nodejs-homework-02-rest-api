const express = require('express')
const router = express.Router()
const controllersUsers = require('../../src/controllers/controllersUsers')
const guard = require('../../src/helpers/guard')
const upload = require('../../src/helpers/multer')

router.post('/signup', controllersUsers.signup)
router.post('/login', controllersUsers.login)
router.post('/logout', guard, controllersUsers.logout)
router.get('/current', guard, controllersUsers.getAllContacts)
router.put('/:contactId', controllersUsers.updateUser)
router.patch('/avatars', guard, upload.single('avatar'), controllersUsers.updateAvatars)

module.exports = router
