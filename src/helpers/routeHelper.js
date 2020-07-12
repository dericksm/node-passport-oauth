const { registerValidation, loginValidation } = require("../validation/UserValidation")

module.exports = {
    validateBody: (req, res, next) => {
        // Data validation
        const result = registerValidation(req.body)
        if (result.error) return res.status(400).send(result.error.details[0].message)

        if (!req.value) { req.value = {} }
        req.value['body'] = result.value
        next()
    },
    validateBodyLogin: (req, res, next) => {
        // Data validation
        const result = loginValidation(req.body)
        if (result.error) return res.status(400).send(result.error.details[0].message)

        if (!req.value) { req.value = {} }
        req.value['body'] = result.value
        next()
    }
}