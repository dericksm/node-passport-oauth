const User = require("../models/User")
const jwt = require('jsonwebtoken')
require('dotenv/config')

signToken = user => {
    console.log(user)
    return jwt.sign({
        sub: user._id,
    }, process.env.TOKEN, { expiresIn: '1d' })
}

module.exports = {
    signUp: async(req, res) => {
        const { name, email, password } = req.body

        //Check if email is already in use
        const emailExists = await User.findOne({ 'local.email': email })
        if (emailExists) return res.status(400).send({ "error": "Email already in use" })

        //Create new user
        const user = new User({
            method: 'local',
            local: {
                name,
                email,
                password
            }
        })

        // Create a new user
        try {
            const savedUser = await user.save()
            const token = signToken(savedUser)
            res.json({ token })
        } catch (error) {
            res.status(400).send(error)
        }
    },
    signIn: async(req, res) => {
        const token = signToken(req.user)
        res.status(200).json({ token })
    },
    googleOauth: async(req, res) => {
        const token = signToken(req.user)
        res.status(200).json({ token })
    },
    facebookOauth: async(req, res) => {
        const token = signToken(req.user)
        res.status(200).json({ token })
    },
    secret: async(req, res) => {
        res.json({ "batata": "olha o macaco" })
    }
}