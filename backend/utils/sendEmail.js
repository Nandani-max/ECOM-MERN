const nodemailer = require("nodemailer") ;

const sendEmail = async (email , subject , message) => {
    try { 
        const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
        });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: message
    };

    await transport.sendMail(mailOptions);
}
 catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
 }
};  

module.exports = sendEmail ;