const express = require('express')
const router = express.Router()
const controllersUsers = require('../../src/controllers/controllersUsers')
const guard = require('../../src/helpers/guard')
const upload = require('../../src/helpers/multer')

// router.get('/current', guard, controllersUsers.getAllContacts)
router.get('/current', guard, controllersUsers.currentUser)
// eslint-disable-next-line spaced-comment
router.get('/verify/:verificationToken', controllersUsers.verifyUser) /*сдесь token приходит в письме*/
router.post('/signup', controllersUsers.signup)
router.post('/login', controllersUsers.login)
router.post('/logout', guard, controllersUsers.logout)
router.patch('/:contactId', guard, controllersUsers.updateUser)
router.patch('/avatars', guard, upload.single('avatar'), controllersUsers.updateAvatars)

module.exports = router
