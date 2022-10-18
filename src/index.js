//=======================================Importing Module and Packages===========================================
const express = require('express');
const mongoose = require('mongoose');
const route = require('./routes/route')
const multer = require('multer')
const { AppConfig } = require('aws-sdk')

const app = express();


app.use(express.json());
app.use(multer().any())


mongoose.connect("mongodb+srv://Mailarappa:XiyjAWCBrRkxLCoM@cluster0.gf6sdcb.mongodb.net/group7Database")
    .then(() => console.log("MongoDb is connected"))
    .catch((err) => console.log(err))


app.use('/', route)

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});