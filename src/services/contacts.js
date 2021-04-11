const Contact = require('../schemas/contacts')

class ContactsService {
  constructor() {
    process.nextTick(async () => {
      const contact = await Contact
      this.model = contact
    })
  }

  async listContacts() {
    const contacts = await this.model.find({})
    console.log(contacts)
    return contacts
  }

  async getContactById(contactId) {
    // const objectId = ObjectID(contactId)
    const contactById = await this.model.findOne({ _id: contactId })
    console.log(contactById)
    return contactById
  }

  async addContact(body, userId) {
    const contact = await this.model.create({ ...body, owner: userId })
    console.log(contact)
    return contact
  }

  async updateContact(contactId, body) {
    // const objectId = ObjectID(contactId)
    const contact = await this.model.findByIdAndUpdate(
      { _id: contactId },
      { ...body },
      { new: true },
    )
    return contact
  }

  async removeContact(contactId) {
    // const objectId = ObjectID(contactId)
    const contact = await this.model.findByIdAndRemove({ _id: contactId })
    console.log(contact)
    return contact
  }
}

module.exports = ContactsService
