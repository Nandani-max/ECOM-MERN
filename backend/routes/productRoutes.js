const express = require("express");
const { get } = require("mongoose");
const router = express.Router() ; 
const {getProducts , createProduct} = require("../controller/productController") ;
const {protect , admin} = require("../middleware/authMiddleware") ;
const {getProductById , updateProduct , deleteProduct} = require("../controller/productController") ;
const multer = require("multer") ;
const upload = multer({ dest: "uploads/" }) ; // specify the destination folder for uploaded files


router.route("/").get(getProducts).post(protect , admin , upload.single("image") , createProduct) ;
router.route('/:id').get(getProductById).put(protect , admin , upload.single("image") , updateProduct).delete(protect , admin , deleteProduct)    // get all products
module.exports = router ; 

// C-- Post 
// R -- Get
// U -- Update
// D -- Delete