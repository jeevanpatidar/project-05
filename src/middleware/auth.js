const validator = require('../validation/validation')
const jwt = require('jsonwebtoken')

const authentication = (req, res, next) => {
    try {
        let token = req.headers['x-api-key']
       
        if (!validator.isValid(token) || typeof token == "undefined") return res.status(400).send({ status: false, Message: "Please Enter token" })

        const bearer = token.split(' ') // get the 1 index value
        const bearerToken = bearer[1]

        jwt.verify(bearerToken, 'project/booksManagementGroup7', function (err, decode) {
            if (err) {
                return res.status(401).send({ status: false, Message: err.message })
            } else {
               
                req.tokenData = decode;
                if (decode.exp > Date.now()) {
                    next()
                } else {
                    return res.status(401).send({ status: false, message: "token has been expired" })
                }
            }
        })
    } catch (err) {
        res.status(500).send({ status: false, Message: err.message })
    }
}


module.exports=authentication