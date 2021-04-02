const Joi = require('joi')
const { HttpCode } = require('../helpers/constans')

const { ContactsService } = require('../services')
const contactsService = new ContactsService()

const getAll = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts()
    res.status(HttpCode.OK).json({
      status: 'Success',
      code: HttpCode.OK,
      data: {
        contacts
      }
    })
  } catch (err) {
    next(err)
  }
}

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params
    const contact = await contactsService.getContactById(contactId)
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'Success',
        code: HttpCode.OK,
        data: {
          contact
        }
      })
    } else {
      next({
        status: HttpCode.NOT_FOUND,
        message: 'Not Found Contact',
        data: 'Not Found'
      })
    }
  } catch (err) {
    next(err)
  }
}

const create = async (req, res, next) => {
  const { name, email, phone } = req.body
  const contactsShema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string()
  })
  const { error } = contactsShema.validate(req.body)
  if (error) {
    res.json({
      status: 'Error',
      message: error.details[0].message
    })
  } else {
    try {
      const contact = await contactsService.addContact(name, email, phone)
      res.status(HttpCode.CREATED).json({
        status: 'Success',
        message: `Contact with name: ${name} added successfully!`,
        code: HttpCode.CREATED,
        data: {
          contact
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

const remove = async (req, res, next) => {
  try {
    const { contactId } = req.params
    const contact = await contactsService.removeContact(contactId)
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'Success',
        message: `Contact with id:${contactId} deleted successfully!`,
        code: HttpCode.OK,
        data: {
          contact
        }
      })
    } else {
      next({
        status: HttpCode.NOT_FOUND,
        message: 'Not Found Contact',
        data: 'Not Found'
      })
    }
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  try {
    const { contactId } = req.params
    const contact = await contactsService.updateContact(contactId, req.body)
    if (contact) {
      res.status(HttpCode.OK).json({
        status: 'Success',
        message: `Contact with id:${contactId} and name:${req.body.name} updated successfully!`,
        code: HttpCode.OK,
        data: {
          contact
        }
      })
    } else {
      next({
        status: HttpCode.NOT_FOUND,
        message: 'Not Found Contact',
        data: 'Not Found'
      })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAll,
  getById,
  create,
  remove,
  update,
}
