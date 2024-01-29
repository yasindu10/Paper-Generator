
const express = require('express')
const payRouter = express.Router()

const {
    createPayment,
    successPayment,
    cancelPayment
} = require('../controller/payController')

const { authorizationPermission } = require('../middlewares/authorization')


payRouter.use(authorizationPermission(['n-user', 'admin']))

// the tools app payment
payRouter.get('/', createPayment)
payRouter.get('/success', successPayment)
payRouter.get('/cancel', cancelPayment)

module.exports = payRouter