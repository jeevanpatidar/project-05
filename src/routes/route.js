//====================================Importing Module and Packages==========================================
const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { authentication, authorization } = require("../middleware/auth")
const productController = require("../controllers/produtController")
const cartController = require("../controllers/cartController")
const orderController = require("../controllers/orderController")

//=========================================USER API's==========================================================
router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)
router.get("/user/:userId/profile", authentication, userController.getUserById)
router.put("/user/:userId/profile", authentication, authorization, userController.updateUser)

//=========================================PRODUCT API's========================================================
router.post("/products", productController.createProduct)
router.get("/products", productController.getProduct)
router.get("/products/:productId", productController.getProductById)
router.put("/products/:productId", productController.updateProduct)
router.delete("/products/:productId", productController.deleteById)

//=========================================CART API's============================================================
router.post("/users/:userId/cart", authentication, authorization, cartController.createCart)
router.put("/users/:userId/cart", authentication, authorization, cartController.updateCart)
router.get("/users/:userId/cart", authentication, authorization, cartController.getById)
router.delete("/users/:userId/cart", authentication, authorization, cartController.deleteById)

//=========================================ORDER API's============================================================
router.post("/users/:userId/orders", authentication, authorization, orderController.createOrder)
router.put("/users/:userId/orders", authentication, authorization, orderController.updateOrder)


router.all("/*", (req, res) => { res.status(400).send({ status: false, message: "Endpoint is not correct plese provide a proper end-point" }) })

//====================================Module Export=============================================================
module.exports = router;