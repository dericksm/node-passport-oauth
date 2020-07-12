const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { func } = require('@hapi/joi')

const userSchema = mongoose.Schema({
    method: {
        type: String,
        enum: ['local', 'facebook', 'google'],
        required: true
    },
    local: {
        name: {
            type: String,
            max: 255,
            min: 6
        },
        email: {
            type: String,
            max: 255,
            min: 6,
            lowercase: true
        },
        password: {
            type: String,
            max: 1024,
            min: 6
        }
    },
    google: {
        id: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    facebook: {
        id: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function(next) {
    try {
        if (this.method != 'local') {
            next()
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.local.password, salt)
        this.local.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.local.password)
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = mongoose.model('User', userSchema)