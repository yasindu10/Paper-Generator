const express = require('express')
const authRouter = express.Router()
const { memory } = require('../utils/multerHandlers')

const {
    createAccessToken,
    login,
    logout,
    register
} = require('../controller/authController')

authRouter.post('/login', login)
authRouter.post('/register', memory.single('image'), register)
authRouter.delete('/logout', logout)
authRouter.get('/token', createAccessToken)

module.exports = authRouter