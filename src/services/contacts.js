const fs = require('fs')
const path = require('path')
// const shortid = require('shortid')

const contactsPath = path.join('__dirname', '..', 'db', 'contacts.json')

class ContactsService {
  async getAll() {
    try {
      fs.readFile(contactsPath, 'utf-8', (error, data) => {
        if (error) {
          console.log(error)
        }
        // console.log(data)
        const contacts = JSON.parse(data)
        // console.log(contacts)
        return contacts
      })
    } catch (err) {
      console.logerr.message()
    }
  }

  getById(id) {}

  create(body) {}

  update(id, body) {
    return {}
  }

  remove(id) {
    return {}
  }
}

module.exports = ContactsService
