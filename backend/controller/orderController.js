const order = require('../model/Order') ;
const sendEmail = require('../utils/sendEmail') ;

const createOrder = async (req , res) => {
    try {
        const { items, totalAmount, address, paymentId } = req.body;  
        if(!items || items.length ===0|| !totalAmount || !address) {
            return res.status(400).json({ message: 'Invalid order data' });
        }
        
        const newOrder = new order({ userId: req.user.id, items, totalAmount, address, paymentId });
        await newOrder.save();
        const message = `Dear ${req.user.name},\n\nThank you for your order! Your order has been successfully created with the following details:\n\nOrder ID: ${newOrder._id}\nTotal Amount: $${newOrder.totalAmount}\n\nWe will notify you once your order is shipped.\n\nBest regards`;
        await sendEmail(req.user.email, 'Order Created', message);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await order.find({}).populate('userId' , 'name');  
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const orders = await order.find({ userId : req.user._id }).populate('items.productId' , 'name price');
        console.log(req.user);
        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await order.findById(req.params.id);
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        updatedOrder.status = status;
        await updatedOrder.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
