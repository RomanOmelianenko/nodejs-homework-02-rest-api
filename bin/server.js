const app = require('../app')
const connection = require('../db/mongodb')
const path = require('path')
const createFolderIsNotExist = require('../src/helpers/createFolder')
require('dotenv').config()

const TEMP_DIR = path.join(process.cwd(), process.env.TEMP_DIR)
const PUBLIC_DIR = path.join(process.cwd(), process.env.PUBLIC_DIR)
const AVATARS_DIR = path.join(process.cwd(), process.env.AVATARS_DIR)

const PORT = process.env.PORT || 3000

connection
  .then(() => {
    app.listen(PORT, async () => {
      await createFolderIsNotExist(TEMP_DIR)
      await createFolderIsNotExist(PUBLIC_DIR)
      await createFolderIsNotExist(AVATARS_DIR)
      console.log('Database connection successful')
      console.log(`Server running. Use our API on port: ${PORT}`)
    })
  })
  .catch(err => {
    console.log(`Server not running. Error message: ${err.message}`)
    process.exit(1)
  })
