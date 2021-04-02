const app = require('../app')
const connection = require('../db/mongodb')

const PORT = process.env.PORT || 3000

connection
  .then(() => {
    app.listen(PORT, () => {
      console.log('Database connection successful')
      console.log(`Server running. Use our API on port: ${PORT}`)
    })
  })
  .catch(err => {
    console.log(`Server not running. Error message: ${err.message}`)
  })
