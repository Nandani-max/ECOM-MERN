const Product = require("../model/Product") ;
const cloudinary = require("cloudinary").v2 ; 
require("../config/cloudinary");

// get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// get by id 
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// create a new product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        let imageURl ='';
    if(req.file){
        const result = await cloudinary.uploader.upload(req.file.path);
        imageURl = result.secure_url;
    }
    const product = new Product({
        name,
        description,   
        price,
        category,
        stock,
        imageURL: imageURl
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
    }   
    catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.stock = stock || product.stock;
        let imageURl = '';
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path);
            imageURl = result.secure_url;
        }
        product.imageURL = imageURl || product.imageURL;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }  
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }   
        await product.deleteOne();
        res.json({ message: "Product removed" });
    }   
    catch (error) {
        res.status(500).json({ message: error.message });
    }   
}

module.exports = { getProducts, createProduct, getProductById, updateProduct, deleteProduct };