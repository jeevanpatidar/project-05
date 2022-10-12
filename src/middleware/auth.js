const userModel = require('../Model/userModel')
const validator = require('../validation/validation')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

// const authentication = (req, res, next) => {
//     try {
//         let token = req.headers['x-api-key']
//         // console.log(token)//
        
//         if (!validator.isValid(token) || typeof token == "undefined") return res.status(400).send({ status: false, Message: "Please Enter token" })
//         // console.log(token)
//         // split and get the token only 
//         const bearer = token.split(' ') 
//         const bearerToken = bearer[1]

//         //     const decoded=jwt.decode(token)
//         //     if (Date.now() > (decoded.exp) * 1000) {
//         //   return res.status(440).send({ status: false, message: "Session expired! Please login again." })
//         jwt.verify(bearerToken, 'project/booksManagementGroup7', function (err, decode) {
//             if (err) {
//                 return res.status(401).send({ status: false, Message: err.message })
//             } else {
//                 console.log(decode)
//                 req.tokenData = decode;
//                 if (decode.exp > Date.now()) {
//                     next()
//                 } else {
//                     return res.status(401).send({ status: false, message: "token has been expired" })
//                 }


//             }
//         })
//     } catch (err) {
//         res.status(500).send({ status: false, Message: err.message })
//     }
// }


const authentication = async function(req, res, next) {
    try {
        const token = req.rawHeaders[1].replace("Bearer ", "")

        if (!token) {
            return res.status(400).send({ status: false, message: "required token" })
        }

        jwt.verify(token, "project/productManagementGroup7", function(err, decoded) {
            if (err) {
                return res.status(401).send({ status: false, message: err.message })
            }
            req.tokenData = decoded
            next()
        })
    } catch (err) {
        res.status(500).send({ status: false, Message: err.message })
    }
}

const authorization = async (req, res, next) => {
    // get user id fron params
    const userId = req.params.userId

    //  get user id from token
    const token = req.tokenData

    //  check valid object id
    if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, Message: "Invalid user ID!" })

    // check the user exist in db
    const user = await userModel.findById(userId)
    if (!user) return res.status(404).send({ status: false, Message: " No user found!" })

    // auth Z 
    if (userId !== token.userId) return res.status(401).send({ status: false, Message: " Unauthorized user!" })

    next()
}

module.exports = { authentication, authorization }