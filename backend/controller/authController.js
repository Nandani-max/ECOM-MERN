const User = require("../model/User.js")
const Otp = require("../model/Otp.js")
const bycrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sendEmail = require("../utils/sendEmail.js")  

const generateToken =(id) => {
    return jwt.sign({id} , process.env.JWT_SECRET , {expiresIn : "30d"})
}
const registerUser = async (req , res) => {
    const {name , email , password} = req.body  ;
    try{
        const existingUser = await User.findOne({email}) ; 
        if(existingUser){
            return res.status(400).json({message : "User already exists"});
        }

        const salt = await bycrypt.genSalt(10) ; 
        const hashedPassword = await bycrypt.hash(password , salt) ; 
        const user = await User.create({name , email , password: hashedPassword}) ; 

        if(user){
            const otp = Math.floor(100000 + Math.random()*900000).toString();
            const otpSalt = await bycrypt.genSalt(10) ;
            const hashedOtp = await bycrypt.hash(otp, otpSalt) ; 
            await Otp.create({email , otp : hashedOtp}) ;

            const message = `Welcome to Shopnest ${name} 
            Your OTP for ShopNest registration is : ${otp}
            Thankyou for registration!`
            await sendEmail(email , "Welcome!!" , message) ; 

            res.status(201).json({
                message : "OTP sent to your email. Please verify to complete registration.",
                email
            });
        }
        else{
            res.status(400).json({
                message : "Invalid user data"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
const loginUser = async (req , res) => {
    const {email , password} = req.body ;   
    try {
        const user = await User.findOne({email}) ;
        if(!user){
            return res.status(400).json({message : "User does not exist"});
        }
        const isPasswordValid = await bycrypt.compare(password , user.password) ;
        if(!isPasswordValid){
            return res.status(400).json({message : "Invalid password"});
        }
        res.status(200).json({
            id : user._id ,
            name : user.name , 
            email : user.email , 
            token : generateToken(user._id) , 
            role : user.role ,
            message : "User logged in successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


const getUsers = async (req , res) => {
    try {
        const users = await User.find({}).select("-password") ; // Exclude password field
        res.status(200).json(users) ; 
    } catch (error) {
        res.status(500).json({message : error.message}) ; 
    }
};

const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const otpData = await Otp.findOne({ email });
        if (!otpData) {
            return res.status(400).json({ message: "OTP not found or expired" });
        }

        const isOtpValid = await bycrypt.compare(otp.toString(), otpData.otp);
        if (!isOtpValid) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.verified = true;
        await user.save();
        await Otp.deleteMany({ email });

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            role: user.role,
            message: "Email verified successfully. Registration complete."
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }  
}


module.exports = {registerUser , loginUser , getUsers, verifyEmail} ; 