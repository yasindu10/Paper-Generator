const { ref, uploadBytes, getStorage } = require("firebase/storage")
const ErrorHandler = require("../errors/customErrors")

const User = require("../models/user")
const Token = require("../models/token")

const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require('uuid')

const register = async (req, res) => {
    if (!req.file) throw new ErrorHandler("No image selected", 400)

    const path = ref(getStorage(), `profilePics/${uuidv4()}.jpg`)
    await uploadBytes(path, req.file.buffer, { contentType: 'image/jpeg' })

    const user = await User.create({
        ...req.body,
        profilePic: req.file.originalname,
        role: 'n-user',
    })

    res.status(200).json({ success: true, data: user })
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password)
        throw new ErrorHandler("please enter email and password", 400)

    const user = await User.findOne({ email })
    if (!user) throw new ErrorHandler(`no user with email ${email}`, 404)

    if (!(await user.comparePassword(password))) {
        throw new ErrorHandler(`incorrect password`, 400)
    }

    const accessToken =
        user.createToken(process.env.ACCESS_TOKEN_KEY, "10m")

    const refreshToken =
        user.createToken(process.env.REFRESH_TOKEN_KEY, "30m")

    const tokenUser = await Token.findOne({ userId: user._id })
    if (tokenUser) {
        console.log('already a user')
        await Token.updateOne({ userId: user._id }, {
            $push: { refreshToken: refreshToken }
        })
    } else {
        console.log('new user')
        await Token.create({ userId: user._id, refreshToken })
    }

    res.cookie("jwt", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 50,
        secure: true,
        httpOnly: true,
    })
    res.status(200).json({ success: true, accessToken })
}

const logout = async (req, res) => {
    const refreshToken = req.cookies?.jwt

    if (!refreshToken) {
        throw new ErrorHandler(`no refresh token found`, 404)
    }

    const userToken = await Token.findOne({ refreshToken: [refreshToken] })
    if (!userToken) throw new ErrorHandler(`Forbidden`, 404)

    await userToken.deleteOne()
    res.clearCookie("jwt")
    res.status(200).json({ success: true, data: "logout success" })
}

const createAccessToken = async (req, res) => {
    const refreshToken = req.cookies?.jwt
    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY)
    } catch (error) {
        throw new ErrorHandler(`Forbidden`, 401)
    }

    const tokenUser = await Token.findOne({ refreshToken })
    if (!tokenUser) {
        throw new ErrorHandler(`Forbidden`, 401)
    }

    const user = await User.findOne({ _id: tokenUser.userId })
    const accessToken = user.createToken(process.env.ACCESS_TOKEN_KEY, "10m")

    res.status(200).json({ success: true, accessToken })
}

module.exports = {
    register,
    login,
    logout,
    createAccessToken,
}