const userModel = require("../Model/userModel")
const bcrypt = require("bcrypt")
const validator = require("../validation/validation")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const { uploadFile } = require("./aws")

const phoneRex = /^[6789][0-9]{9}$/


const createUser = async (req, res) => {
    try {
        //fetching data present in request body 
        let files = req.files;
        const requestBody = req.body

        if (!validator.isValidBody(requestBody)) return res.status(400).send({ status: false, message: 'Please provide user details' })
        //Destructuring requestBody
        let { fname, lname, phone, email, password, address, ...rest } = requestBody
        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: `${Object.keys(rest)} => Invalid Attribute` })
        //--------------------------------Validation starts-------------------------------
        //fname
        if (!validator.isValid(fname)) return res.status(400).send({ status: false, message: `fname is required` });
        if (!fname.trim().match(/^[a-zA-Z]{2,20}$/)) return res.status(400).send({ status: false, message: `Firstname should only contain alphabet` });

        //lname
        if (!validator.isValid(lname)) return res.status(400).send({ status: false, message: `lname is required ` });
        if (!lname.trim().match(/^[a-zA-Z]{2,20}$/)) return res.status(400).send({ status: false, message: `lname should only contain alphabet ` });

        //email
        if (!validator.isValid(email)) return res.status(400).send({ status: false, message: `Email is required` })
        email = email.trim().toLowerCase()
        if (!validator.isValidEmail(email)) return res.status(400).send({ status: false, message: `Email should be a valid email address ` })
        const isEmailAlreadyUsed = await userModel.findOne({ email });
        if (isEmailAlreadyUsed) return res.status(400).send({ status: false, message: `${email} email address is already registered` })

        //profileImage
        if (!files || (files && files.length === 0)) return res.status(400).send({ status: false, message: 'Profile image is required' })
        const profilePicture = await uploadFile(files[0], "user")

        //phone
        if (!validator.isValid(phone)) return res.status(400).send({ status: false, message: 'phone no is required' });
        phone = phone.trim()
        if (phone.length != 10) return res.status(400).send({ status: false, message: `${phone.length} is not valid phone number length` })
        if (!phone.match(phoneRex)) return res.status(400).send({ status: false, message: `Please fill Indian phone number` })
        const isPhoneAlreadyUsed = await userModel.findOne({ phone });
        if (isPhoneAlreadyUsed) return res.status(400).send({ status: false, message: `${phone} phone number is already registered` })

        //password
        if (!validator.isValid(password)) return res.status(400).send({ status: false, message: `Password is required` })
        if (!validator.isValidPassword(password)) return res.status(400).send({ status: false, message: `Password must between 8-5 and contain a Capital,Symbol,Numeric` })

        //address
        if (!validator.isValid(address))
            return res.status(400).json({ status: false, msg: "Address is required" });
        // address=JSON.parse(address) 
        //if (typeof address != "object") return res.status(400).json({ status: false, msg: "Please provide Address in Object" });
        address = JSON.parse(address)
        if (address) {
            if (typeof address != "object") return res.status(400).send({ status: false, message: "Please provide Address in Object" })

            if (address) {
                if (address.shipping) {
                    if (!validator.isValid(address.shipping.street)) return res.status(400).send({ status: false, Message: "Shipping Street is required" })

                    if (!validator.isValid(address.shipping.city)) return res.status(400).send({ status: false, Message: "Shipping city is required" })

                    if (!validator.isValid(address.shipping.pincode)) return res.status(400).send({ status: false, Message: "Shipping pincode is required" })

                    if (!/^[1-9][0-9]{5}$/.test(address.shipping.pincode)) return res.status(400).send({ status: false, message: "Shipping Pincode should in six digit Number" })
                } else {
                    return res.status(400).send({ status: false, message: "please provide shipping address" })
                }

                if (address.billing) {
                    if (!validator.isValid(address.billing.street)) return res.status(400).send({ status: false, Message: "Billing street is required" })

                    if (!validator.isValid(address.billing.city)) return res.status(400).send({ status: false, Message: "Billing city is required" })

                    if (!validator.isValid(address.billing.pincode)) return res.status(400).send({ status: false, Message: "Billing pincode is required" })

                    if (!/^[1-9][0-9]{5}$/.test(address.billing.pincode)) return res.status(400).send({ status: false, message: "Billing pincode is invalid", })
                } else {
                    return res.status(400).send({ status: false, message: "please provide billing address" })
                }
            }

            // ---------------------------------Validation ends-------------------------------
            //generating salt
            const salt = await bcrypt.genSalt(10)
            //hashing
            const hashedPassword = await bcrypt.hash(password, salt)
            //response structure
            const userData = {
                fname: fname,
                lname: lname,
                profileImage: profilePicture,
                email: email,
                phone: phone,
                password: hashedPassword,
                address: address,
            }

            const newUser = await userModel.create(userData);
            return res.status(201).send({ status: true, message: ` User created successfully`, data: newUser });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

const loginUser = async function (req, res) {
    try {
        let loginData = req.body
        let { email, password } = loginData

        //validation
        if (!validator.isValidBody(loginData)) return res.status(400).send({ status: false, message: "Please fill email or password" })
        let empStr = ""
        if (!validator.isValidEmail(email)) empStr = empStr + "Email "
        if (!validator.isValidPassword(password)) empStr = empStr + "Password"
        if (!validator.isValidEmail(email) || !validator.isValidPassword(password)) {
            return res.status(400).send({ status: false, message: `Please fill valid or mandatory ${empStr}` })
        }

        let user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).send({ status: false, message: "Email Not found" });
        }
        //comparing hard-coded password to the hashed password
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(400).send({ status: false, message: "wrong password" })
        }

        let iat = Date.now()
        let exp = (iat) + (60 * 60 * 60 * 1000)
        //token credentials
        let token = jwt.sign(
            {
                userId: user._id.toString(),
                iat: iat,
                exp: exp
            },
            "project/productManagementGroup7"// => secret key
        );

        //res.status(200).setHeader("x-api-key", token);
        return res.status(200).send({ status: true, message: "Successful login", data: { userId: user._id, token: token } })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, message: `Invalid userId in params` })
        const user = await userModel.findOne({ _id: userId })
        if (!user) return res.status(404).send({ status: false, message: "UserId Not found" })
        //authorization
        if (userId != req.tokenData.userId) return res.status(401).send({ status: false, Message: "Unauthorized user!" })
        return res.status(200).send({ status: true, message: 'User profile details', data: user })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { createUser, loginUser,getUserById }