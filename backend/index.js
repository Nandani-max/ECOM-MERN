const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]); 
const connectDB = require("./config/db");
const routers = require("./routes/authRoutes");

dotenv.config();

const app = express();

connectDB();


app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Backend is working properly");
});

app.use("/api/auth", routers);
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("Server is running");
});