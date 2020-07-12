const router = require('express').Router()
const verify = require('./tokenValidation')

router.get('/', verify, (req, res) => {
    res.json({
        posts: {
            title: "I don't know",
            description: "I don't know too"
        }
    })
})

module.exports = router