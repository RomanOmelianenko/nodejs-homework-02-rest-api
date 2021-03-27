const express = require('express')
const router = express.Router()
const controllersContacts = require('../../src/controllers/controllersContacts')

router
  .get('/', controllersContacts.getAll)
  .get('/:contactId', controllersContacts.getById)
  .post('/', controllersContacts.create)
  .delete('/:contactId', controllersContacts.remove)
  .patch('/:contactId', controllersContacts.update)

module.exports = router
