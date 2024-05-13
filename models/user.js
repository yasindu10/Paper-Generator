const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const schema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        maxlength: [25, 'username is too long']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'please enter a email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, , 'please enter a valid']
    },
    password: {
        type: String,
        required: [true, 'please enter your password'],
    },
    profilePic: {
        type: String,
        required: [true, 'please enter a profile pic']
    },
    role: {
        type: String,
        enum: [
            'admin',
            'n-user',
            'p-user'
        ]
    },
})

schema.pre('save', async function () {
    const solt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, solt)
})

schema.methods.comparePassword = async function (currentPassword) {
    return await bcrypt.compare(currentPassword, this.password)
}

module.exports = mongoose.model('Users', schema)