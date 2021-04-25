const path = require('path')
const multer = require('multer')
require('dotenv').config()

const TEMP_DIR = path.join(process.cwd(), process.env.TEMP_DIR)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_DIR)
  },
  filename: function (req, file, cb) {
    const now = new Date()
    const newNameFile = `${now.getTime()}-${file.originalname}`
    console.log('newNameFile:', newNameFile)
    cb(null, newNameFile)
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true)
      return
    }
    cb(null, false)
  },
})

module.exports = upload
