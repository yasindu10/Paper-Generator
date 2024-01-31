
const mongoose = require('mongoose')

const connectDb = async (URL) => {
    return await mongoose.connect(URL)
}

module.exports = connectDb