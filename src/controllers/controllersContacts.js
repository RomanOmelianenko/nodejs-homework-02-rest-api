// Шаг 3. Методы(обработчики) маршрутов. Они ничего не делают кроме как формируют ответ
// Они будут пробрасывать данные в contactsService, он будет стучаться в репозиторий(базу данных),
// получать эти данные, отдавать контроллер, а контроллер уже формирует ответ

const { HttpCode } = require('../helpers/constans')

const { ContactsService } = require('../services')
const contactsService = new ContactsService()

const getAll = (req, res, next) => {
  try {
    const contacts = contactsService.getAll()
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

const getById = (req, res, next) => {
  try {
    const contact = contactsService.getById(req.params)
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

const create = (req, res, next) => {
  try {
    const contact = contactsService.create(req.body)
    res.status(HttpCode.CREATED).json({
      status: 'Success',
      code: HttpCode.CREATED,
      data: {
        contact
      }
    })
  } catch (err) {
    next(err)
  }
}

const remove = (req, res, next) => {
  try {
    const contact = contactsService.remove(req.params)
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

const update = (req, res, next) => {
  try {
    const contact = contactsService.update(req.params, req.body)
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

module.exports = {
  getAll,
  getById,
  create,
  remove,
  update,
}
