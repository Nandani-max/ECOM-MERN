const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controller/analyticsController");
const { protect , admin } = require("../middleware/authMiddleware");    

router.get("/", protect,admin ,  getAdminStats);


module.exports = router;