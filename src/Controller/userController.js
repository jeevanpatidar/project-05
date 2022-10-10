const userModel = require("../model/userModel");
const validator = require("../validation/validation");
const validation = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")




const createUser = async function(req, res) {
    try {

        if (files = req.files) {
            if (files && files.length > 0) {
                //upload to s3 and get the uploaded link
                // res.send the link back to frontend/postman
                let uploadedFileURL = await uploadFiles.uploadFile(files[0])
                return res.status(201).send({ msg: "file uploaded succesfully", data: uploadedFileURL })
            } else {
                return res.status(400).send({ msg: "No file found" })
            }
        }
        
        if(data = req.body){
        let { fname,lname,email,profileImage, phone, password, address } = data;
        //-----------------------validation for ReqBody------------------------------------//

        if (Object.keys(data).length == 0)
            return res
                .status(400)
                .send({
                    status: false,
                    msg: "Request body cannot be empty,please provide user details to create user",
                });

        //-----------------------validation for title------------------------------------//
        if (!validator.isValid(fname))
            return res .status(400) .send({ status: false, msg: "Please enter a valid fname",});
        //-----------------------validation for name------------------------------------//
        if (!validator.isValid(lname))
            return res.status(400).send({ status: false, msg: "lname is Mandatory" });
        //-----------------------validation for email------------------------------------//
        if (!validator.isValid(email))
            return res.status(400).send({ status: false, msg: "email is Mandatory" });

        if (!validation.isEmail(email))
            return res.status(400) .send({ status: false, msg: "please provide valid email" });
      
       if (!validation.isValid(profileImage))
            return res.status(400) .send({ status: false, msg: "please provide valid profileImage" });


        //-----------------------validation for phone------------------------------------//
        if (!validator.isValid(phone))
            return res
                .status(400)
                .send({ status: false, msg: "phone number is mandatory" });

        const mobile = /^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone);
        if (mobile == false)
            return res
                .status(400)
                .send({
                    status: false,
                    msg: "Mobile number should be a valid Indian mobile number",
                });
        //-----------------------validation for password------------------------------------//
        if (!validator.isValid(password))
            return res
                .status(400)
                .send({ status: false, msg: "password is Mandatory" });

        const password1 =
            /^(?=.[a-z])(?=.[A-Z])(?=.[0-9])(?=.[!@#\$%\^&\*])(?=.{8,15})/.test(
                password
            );
        if (password1 == false)
            return res
                .status(400)
                .send({
                    status: false,
                    msg: "Password should contain min:8 and max:15 characters ",
                });


               
        //-----------------------validation for address------------------------------------//
        if (address) {
            if (typeof address != "object")
                return res
                    .status(400)
                    .send({ status: false, msg: "Type of address must be object" });

            if (Object.keys(address).length === 0)
                return res
                    .status(400)
                    .send({
                        status: false,
                        msg: "Address body cannot be empty,please provide address details",
                    });

            if (!validator.isValid(address.street))
                return res
                    .status(400)
                    .send({ status: false, msg: "street is Mandatory" });

            if (!validator.isValid(address.city))
                return res
                    .status(400)
                    .send({ status: false, msg: "city is Mandatory" });

            if (!validator.isValid(address.pincode))
                return res
                    .status(400)
                    .send({ status: false, msg: "pincode is Mandatory" });
        }

        //-----------------------validation for Duplicate phone,email-----------------------------------//
        let dupPhone = await userModel.findOne({ phone: phone });
        if (dupPhone)
            return res
                .status(409)
                .send({
                    status: false,
                    msg: `This mobile number is ${phone} already in use `,
                });

        let dupEmail = await userModel.findOne({ email: email }); if (dupEmail)return res.status(409)
                .send({
                    status: false,
                    msg: `This email id is ${email} already in use `,
                });

        //-----------------------create user------------------------------------//
        let createdUser = await userModel.create(data);
        return res
            .status(201)
            .send({ status: true, message: "Success", data: createdUser });
        //console.log(createdUser)
    }
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }};
