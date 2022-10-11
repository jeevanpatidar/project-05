
const express=require("express")
const router=express.Router()

const userController=require("../controllers/userController")


/*----------------------------USER API's-------------------------------------- */
router.post("/register",userController.createUser)
router.post('/login', userController.loginUser)


router.all("/*", (req, res) => { res.status(400).send({ status: false, message: "Endpoint is not correct plese provide a proper end-point" }) })


module.exports = router;