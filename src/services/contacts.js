const fs = require('fs')
const path = require('path')
const fsPromises = fs.promises
const shortid = require('shortid')

const contactsPath = path.resolve('./db', 'contacts.json')

class ContactsService {
  async listContacts() {
    try {
      const contacts = JSON.parse(
        await fsPromises.readFile(contactsPath, 'utf-8',
          (err, data) => {
            if (err) console.log(err)
          }
        )
      )
      console.log(contacts)
      return contacts
    } catch (error) {
      console.log(error.message)
    }
  }

  async getContactById(contactId) {
    try {
      const contacts = JSON.parse(await fsPromises.readFile(contactsPath, 'utf-8',
        (err, _data) => {
          if (err) console.log(err)
        }
      ))
      const findContactById = contacts.find(contact => contact.id.toString() === contactId)
      // console.log(findContactById)
      return findContactById
    } catch (error) {
      console.log(error.message)
    }
  }

  async addContact(name, email, phone) {
    try {
      const contact = JSON.parse(await fsPromises.readFile(contactsPath, 'utf-8',
        (err, _data) => {
          if (err) console.log(err)
        }
      ))
      const addNewContact = {
        id: shortid.generate(),
        name,
        email,
        phone,
      }
      contact.push(addNewContact)
      console.log(contact)
      await fsPromises.writeFile(contactsPath, JSON.stringify(contact), error => {
        if (error) {
          return console.log(error)
        }
      })
      if (contact) {
        console.log(`Contact with name ${name} added successfully!`)
      }
      return contact
    } catch (error) {
      console.log(error.message)
    }
  }

  async updateContact(contactId, body) {
    try {
      const contacts = JSON.parse(await fsPromises.readFile(contactsPath, 'utf-8',
        (err, _data) => {
          if (err) console.log(err)
        }
      ))
      const findContactById = contacts.find(contact => contact.id === contactId)
      const contactsInDB = contacts.filter(contact => contact.id !== contactId)
      const сontactWasFound = { ...findContactById, ...body }
      await fsPromises.writeFile(contactsPath, JSON.stringify(
        [...contactsInDB, сontactWasFound]), error => {
        if (error) {
          return console.log(error)
        }
      })
      if (findContactById) {
        console.log(`Contact with id ${contactId} updated successfully!`)
        console.log(сontactWasFound)
        return сontactWasFound
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  async removeContact(contactId) {
    try {
      const contact = JSON.parse(await fsPromises.readFile(contactsPath, 'utf-8',
        (err, _data) => {
          if (err) console.log(err)
        }
      ))
      const removeContactById = contact.filter(contact => contact.id.toString() !== contactId)
      if (contact.length === removeContactById.length) {
        console.log(`Not found contact with id:${contactId}`)
        return
      }
      await fs.writeFile(contactsPath, JSON.stringify(removeContactById), error => {
        if (error) {
          console.log(error)
        }
      })
      console.log(`Contact with id:${contactId} was removed!`)
      // console.log(removeContactById)
      return removeContactById
    } catch (err) {
      console.log(err.message)
    }
  }
}

module.exports = ContactsService
