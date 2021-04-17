const Contact = require('../schemas/contacts')

class ContactsService {
  constructor() {
    process.nextTick(async () => {
      const contact = await Contact
      this.model = contact
    })
  }

  async listContacts(userId, { limit = 20, offset = 0, sortBy, sortByDesc, filter }) {
    const { docs: contacts, totalDocs: total } = await this.model.paginate(
      { owner: userId },
      {
        limit,
        offset,
        sort: {
          ...sortBy ? { [`${sortBy}`]: 1 } : {},
          ...sortByDesc ? { [`${sortByDesc}`]: -1 } : {}
        },
        select: filter ? filter.split('|').join('') : '',
        populate: {
          path: 'owner',
          select: 'name email phone'
        }
      }
    )
    return { contacts, total, limit: Number(limit), offset: Number(offset) }
  }

  async getContactById(userId, contactId) {
    const contactById = await this.model.findOne({ _id: contactId, owner: userId }).populate({
      path: 'owner',
      select: 'name email phone'
    })
    console.log(contactById)
    return contactById
  }

  async addContact(userId, body) {
    const contact = await this.model.create({ ...body, owner: userId })
    console.log(contact)
    return contact
  }

  async updateContact(userId, contactId, body) {
    const contact = await this.model.findByIdAndUpdate(
      { _id: contactId, owner: userId },
      { ...body },
      { new: true },
    )
    return contact
  }

  async removeContact(userId, contactId) {
    const contact = await this.model.findByIdAndRemove({ _id: contactId, owner: userId })
    console.log(contact)
    return contact
  }
}

module.exports = ContactsService
