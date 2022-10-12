const express=require("express")
const router=express.Router()

const userController=require("../controllers/userController")
const {authentication,authorization}=require("../middleware/auth")
const productController=require("../controllers/produtController")


/*----------------------------USER API's-------------------------------------- */
router.post("/register",userController.createUser)
router.post('/login', userController.loginUser)
//router.get("/user/:userId/profile",authentication,userController.getUserById)
router.put("/user/:userId/profile",authentication,authorization,userController.updateUser)
router.get("/user/:userId/profile",authentication, userController.getUserById)

router.post("/products",productController.createProduct)

router.all("/*", (req, res) => { res.status(400).send({ status: false, message: "Endpoint is not correct plese provide a proper end-point" }) })


module.exports = router;