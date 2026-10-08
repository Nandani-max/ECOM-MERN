// all code of connecting through mongodb 
const mongoose = require("mongoose") ; 
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const coonectDB = async () =>{
    try{
        console.log(process.env.MONGO_URI)
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        console.log('mongodb connected')
    } // return promise which is either true or false 
    catch (error){
        console.log(error)
        process.exit(1) 
    }
};

module.exports = coonectDB ; 
