
const multer = require('multer')

const memory = multer({ storage: multer.memoryStorage() })


module.exports = { memory }