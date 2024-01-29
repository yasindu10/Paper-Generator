const { ref, uploadBytes, getStorage } = require("firebase/storage")
const CustomErrorHandeller = require("../errors/customErrors")

const jwt = require("jsonwebtoken")

const User = require("../models/user")
const Token = require("../models/token")

const { v4: uuidv4 } = require('uuid')

const register = async (req, res) => {
    if (!req.file) throw new CustomErrorHandeller("No image selected", 400)

    const path = ref(getStorage(), `profilePics/${uuidv4()}.jpg`)
    await uploadBytes(path, req.file.buffer)

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
        throw new CustomErrorHandeller("please enter email and password", 400)

    const user = await User.findOne({ email })
    if (!user) throw new CustomErrorHandeller(`no user with email ${email}`, 404)

    if (!(await user.comparePassword(password))) {
        throw new CustomErrorHandeller(`incorrect password`, 400)
    }

    const tokenUser = await Token.findOne({ userId: user._id })

    const refreshToken = jwt.sign(
        { userId: user._id, role: user.role, email: user.email },
        process.env.REFRESH_TOKEN_KEY,
        {
            expiresIn: "30d",
        }
    )

    const accessToken = jwt.sign(
        { userId: user._id, role: user.role, email: user.email },
        process.env.ACCESS_TOKEN_KEY,
        {
            expiresIn: "10m",
        }
    )

    if (tokenUser) {
        // already loged in
        console.log("alredy a user")
        try {
            jwt.verify(tokenUser.refreshToken, process.env.REFRESH_TOKEN_KEY)
            return res.status(200).json({ accessToken })
        } catch (err) {
            throw new CustomErrorHandeller(`expired refresh token`, 400)
        }
    } else {
        console.log("new user")

        // create the token
        await Token.create({ userId: user._id, refreshToken })

        res.cookie("jwt", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 50,
            secure: true,
            httpOnly: true,
        })

        res.status(200).json({ success: true, accessToken })
    }
}

const logout = async (req, res) => {
    const refreshToken = req.cookies?.jwt

    if (!refreshToken) {
        throw new CustomErrorHandeller(`no refresh token found`, 404)
    }

    const refreshUser = await Token.findOne({ refreshToken })

    if (!refreshUser) throw new CustomErrorHandeller(`Forbitten`, 404)

    await refreshUser.deleteOne()
    res.clearCookie("jwt")
    res.status(200).json({ success: true, data: "logout success" })
}

const createAccessToken = async (req, res) => {
    const refreshToken = req.cookies?.jwt

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY)

        const tokenUser = await Token.findOne({ refreshToken })

        if (!tokenUser) {
            throw new CustomErrorHandeller(`Forbitten`, 401)
        }

        const user = await User.findOne({ _id: tokenUser.userId })

        const accessToken = jwt.sign(
            { userId: user._id, role: user.role, email: user.email },
            process.env.ACCESS_TOKEN_KEY,
            {
                expiresIn: "30m",
            }
        )

        res.status(200).json({ success: true, accessToken })
    } catch (err) {
        console.log(`error ${err.message}`)
        throw new CustomErrorHandeller(`Forbitten`, 401)
    }
}

module.exports = {
    register,
    login,
    logout,
    createAccessToken,
}
