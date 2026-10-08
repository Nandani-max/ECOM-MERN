const express = require("express");
const router = express.Router() ;
const {protect , admin} = require("../middleware/authMiddleware") ;
const {createOrder , getOrders , getOrderById , updateOrderStatus} = require("../controller/orderController") ;

router.route("/").post(protect , createOrder).get(protect , admin , getOrders) ; 
router.route("/:id/status").put(protect , admin , updateOrderStatus) ;
router.route("/myorders").get(protect , getOrderById) ; 
module.exports = router ;