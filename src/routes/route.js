const express = require('express')
const router = express.Router();
const userController = require('../Controller/userController')
const middleWare = require('../middleware/auth')

//-------------------register-----------------------------//
router.post('/register', userController.createUser)

//--------------------Loginuser---------------------------//
router.post('/login', userController.loginUser)