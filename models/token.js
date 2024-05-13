const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: [true, 'user id is required']
    },
    refreshToken: {
        type: [String],
        required: [true, 'refreshToken is required']
    }
})

module.exports = mongoose.model('tokens', tokenSchema)