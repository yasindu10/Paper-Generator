const CustomErrorHandeller = require('../errors/customErrors')

const jwt = require('jsonwebtoken')

const authorization = async (req, res, next) => {
    const authorization = req.headers.authorization

    if (!authorization || !authorization.startsWith("Bearer ")) {
        throw new CustomErrorHandeller('No Access Token Found', 404)
    }

    const accessToken = authorization.split(' ')[1]

    try {
        const { role, userId } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY)

        req.user = { role, userId }
        next()
    } catch (error) {
        throw new CustomErrorHandeller('Forbidden!', 401)
    }
}

const authorizationPermission = (roles) => (req, res, next) => {
    if (roles.includes(req.user.role))
        next()

    throw new CustomErrorHandeller("You can't access this resource", 400)
}

module.exports = { authorization, authorizationPermission }