const express=require("express")
const router=express.Router()

const userController=require("../controllers/userController")
const authentication=require("../middleware/auth")


/*----------------------------USER API's-------------------------------------- */
router.post("/register",userController.createUser)
router.post('/login', userController.loginUser)
router.get("/user/:userId/profile",authentication,userController.getUserById)
//router.put("/user/:userId/profile",authentication,userController.updateUser)

router.all("/*", (req, res) => { res.status(400).send({ status: false, message: "Endpoint is not correct plese provide a proper end-point" }) })


module.exports = router;