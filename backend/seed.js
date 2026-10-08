const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./model/User");
const Product = require("./model/Product");
const Order = require("./model/Order");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const seedData = async () => {
  try {
    await connectDB();

    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
        verified: true,
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: "john123",
        role: "user",
        verified: true,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "jane123",
        role: "user",
        verified: false,
      },
    ];

    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await hashPassword(user.password),
      }))
    );

    await User.deleteMany({ email: { $in: users.map((u) => u.email) } });
    const createdUsers = await User.insertMany(hashedUsers);

    const products = [
      {
        name: "Wireless Headphones",
        description: "Noise-cancelling over-ear headphones",
        price: 1299,
        category: "Electronics",
        imageURL: ["https://example.com/headphones.jpg"],
        ratings: 4.7,
        numReviews: 18,
      },
      {
        name: "Smart Watch",
        description: "Fitness and health tracking smartwatch",
        price: 799,
        category: "Wearables",
        imageURL: ["https://example.com/smartwatch.jpg"],
        ratings: 4.5,
        numReviews: 12,
      },
      {
        name: "Gaming Keyboard",
        description: "Mechanical keyboard with RGB lighting",
        price: 1599,
        category: "Electronics",
        imageURL: ["https://example.com/keyboard.jpg"],
        ratings: 4.8,
        numReviews: 25,
      },
    ];

    await Product.deleteMany({ name: { $in: products.map((p) => p.name) } });
    const createdProducts = await Product.insertMany(products);

    const sampleOrder = {
      user: createdUsers[1]._id,
      items: [
        {
          productId: createdProducts[0]._id,
          qty: 1,
          price: createdProducts[0].price,
        },
        {
          productId: createdProducts[2]._id,
          qty: 2,
          price: createdProducts[2].price,
        },
      ],
      totalAmount: 1299 + 1599 * 2,
      address: {
        fullName: "John Doe",
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        country: "USA",
        pinCode: "10001",
      },
      paymentId: "pay_test_123",
      status: "completed",
    };

    await Order.deleteMany({ paymentId: sampleOrder.paymentId });
    await Order.create(sampleOrder);

    console.log("Seed data inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedData();
