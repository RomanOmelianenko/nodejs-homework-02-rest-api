const express = require('express')
const router = express.Router()
const controllersContacts = require('../../src/controllers/controllersContacts')

const guard = require('../../src/helpers/guard')

router
  .get('/', guard, controllersContacts.getAll)
  .get('/:contactId', guard, controllersContacts.getById)
  .post('/', guard, controllersContacts.create)
  .delete('/:contactId', guard, controllersContacts.remove)
  .patch('/:contactId', guard, controllersContacts.update)

module.exports = router
