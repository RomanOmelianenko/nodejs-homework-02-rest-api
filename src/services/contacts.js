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
    // console.log("🚀 ~ file: contacts.js ~ line 46 ~ ContactsService ~ listContacts ~ filter.split('|').join(' ')", filter.split('|').join(' '))
    console.log(contacts)
    return { contacts, total, limit: Number(limit), offset: Number(offset) }
  }

  async getContactById(contactId) {
    const contactById = await this.model.findOne({ _id: contactId }).populate({
      path: 'owner',
      select: 'name email phone'
    })
    console.log(contactById)
    return contactById
  }

  async addContact(body, userId) {
    const contact = await this.model.create({ ...body, owner: userId })
    console.log(contact)
    return contact
  }

  async updateContact(contactId, body) {
    const contact = await this.model.findByIdAndUpdate(
      { _id: contactId },
      { ...body },
      { new: true },
    )
    return contact
  }

  async removeContact(contactId) {
    const contact = await this.model.findByIdAndRemove({ _id: contactId })
    console.log(contact)
    return contact
  }
}

module.exports = ContactsService
