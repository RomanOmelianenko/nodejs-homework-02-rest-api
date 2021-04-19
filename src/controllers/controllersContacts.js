const { HttpCode } = require('../helpers/constans')

const { ContactsService } = require('../services')
const contactsService = new ContactsService()

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id
    console.log(userId)
    const contacts = await contactsService.listContacts(userId, req.query)
    res.status(HttpCode.OK).json({
      status: 'Success',
      code: HttpCode.OK,
      data: {
        ...contacts
      }
    })
  } catch (err) {
    next(err)
  }
}

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { contactId } = req.params
    const contact = await contactsService.getContactById(userId, contactId)
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
  try {
    const userId = req.user.id
    const { name } = req.body
    const contact = await contactsService.addContact(userId, req.body)
    res.status(HttpCode.CREATED).json({
      status: 'Success',
      message: `Contact with name: '${name}' added successfully!`,
      code: HttpCode.CREATED,
      data: {
        contact
      }
    })
  } catch (err) {
    next(err)
  }
}

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { contactId } = req.params
    const contact = await contactsService.removeContact(userId, contactId)
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
    const userId = req.user.id
    const { contactId } = req.params
    const { name } = req.body
    const contact = await contactsService.updateContact(userId, contactId, req.body)
    if (contact) {
      res.status(HttpCode.OK).json({
        status: 'Success',
        message: `Contact with id:${contactId} and name:${name} updated successfully!`,
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
