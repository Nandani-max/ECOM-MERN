const express = require("express")
const router = express.Router() ; 
const {registerUser , loginUser , getUsers, verifyEmail} = require("../controller/authController");
const {protect , admin} = require("../middleware/authMiddleware") ;

router.post("/register" , registerUser)
router.post("/login" , loginUser)
router.get("/users" ,protect , admin ,  getUsers) ;
router.post("/verify-otp" , verifyEmail) ;
router.post("/verify-email" , verifyEmail) ;

module.exports = router ; 