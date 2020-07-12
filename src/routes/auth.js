const router = require('express').Router()
const User = require('../User')
const { registerValidation, loginValidation } = require('../../validation/UserValidation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async(req, res) => {

    const { name, email, password } = req.body
    const user = new User({
        name,
        email,
        password
    })

    // Data validation
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error)

    // Check if email is already in the database
    const emailExist = await User.findOne({ email: email })
    if (emailExist) return res.status(400).send('Email already exists')

    // Hash password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    // Create a new user
    try {
        const savedUser = await user.save()
        res.send(savedUser.id)
    } catch (error) {
        res.status(400).send(err)
    }
})

router.post('/login', async(req, res) => {

    const { email, password } = req.body

    // Data validation
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error)

    // Check if email is already in the database
    const user = await User.findOne({ email: email })
    if (!user) return res.status(400).send('Email not found')

    // Check password
    const validPass = await bcrypt.compare(password, user.password)
    if (!validPass) return res.status(400).send('Invalid password')

    //Generate auth token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN)
    res.header('auth-token', token).send(token)

})
module.exports = router