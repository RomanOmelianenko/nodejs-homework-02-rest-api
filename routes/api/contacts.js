const express = require('express')
const router = express.Router()
const controllerContacts = require('../../src/controllers/controllersContacts')

router
  .get('/', controllerContacts.getAll)
  .get('/:contactId', controllerContacts.getById)
  .post('/', controllerContacts.create)
  // .put('/:contactId', controllerContacts.update)
  .delete('/:contactId', controllerContacts.remove)
  .patch('/:contactId', controllerContacts.update)

module.exports = router
