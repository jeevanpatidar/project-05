const productModel = require("../Model/productModel")
const validator = require("../validation/validation")
const mongoose = require("mongoose")
const { uploadFile } = require("./aws")

const createProduct = async (req, res) => {
    try {
        //fetching data present in request body 
        let files = req.files;
        const requestBody = req.body

        if (!validator.isValidBody(requestBody)) return res.status(400).send({ status: false, message: 'Please provide user details' })
        //Destructuring requestBody
        let { title, description, price, currencyId, currencyFormat, availableSizes, installments } = requestBody

        //title
        if (!validator.isValid(title)) return res.status(400).send({ status: false, message: `title is required` });
        const titles = await productModel.findOne({ title: title })
        if (titles) return res.status(409).send({ status: true, message: `title already exist in DB` });

        //description
        if (!validator.isValid(description)) return res.status(400).send({ status: false, message: `description is required` });

        //price
        if (!price || price == 0) return res.status(400).send({ status: false, message: "price cannot be empty" })
        if (!Number(price)) return res.status(400).send({ status: false, message: "price should be in valid number/decimal format" })
        requestBody.price = Number(price).toFixed(2)

        //currencyId
        if (!validator.isValid(currencyId)) return res.status(400).send({ status: false, message: `currencyId is required` });
        if (currencyId !== "INR") return res.status(400).send({ status: false, message: `currencyId should be indian currency $ type should string` })

        //currencyFormat
        if (!validator.isValid(currencyFormat)) return res.status(400).send({ status: false, message: `currencyFormat is required` });
        if (currencyFormat !== "₹") return res.status(400).send({ status: false, message: `currencyFormat should be indian currency $ type should string` })

                //isFreeShipping
        if (isFreeShipping){
            if(isFreeShipping == 'true'|| isFreeShipping == 'false'|| typeof isFreeShipping === Boolean){return res.status(400).send({ status: false, message: `currencyFormat is required` });}
        }

        //productImage
        if (!files || (files && files.length === 0)) return res.status(400).send({ status: false, message: 'productImage image is required' })
        const ProductImage = await uploadFile(files[0], "user")


        //style

        //availableSizes
        if (Array.isArray(availableSizes)) {
            var enumArr = ["S", "XS", "M", "X", "L", "XXL", "XL"]
        }
        if (!enumArr) return res.status(400).send({ status: false, message: `only this size available $[]` });

        //installments
        if (installments) {
            installments = parseInt(installments)
            if (!installments || typeof installments != 'number') { return res.status(400).send({ status: false, message: `installments should be typeof number` }); }
        }
        if(isDeleted) {
            if(!(isDeleted == "true" || isDeleted == "false" || typeof isDeleted === "boolean"))
                return res.status(400).send({ status: false, message: "isDeleted should be Boolean or true/false" })
            if(isDeleted == true || isDeleted == "true") data.deletedAt = new Date
        }

        const productCreate = {
            title: title,
            description: description,
            price: price,
            currencyId: currencyId,
            ProductImage:ProductImage,
            currencyFormat: currencyFormat,
            availableSizes: availableSizes,
            installments: installments
        }

        let newData = await productModel.create(productCreate)
        return res.status(201).send({ status: true, message: "Document is created successfully", data: newData })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createProduct }