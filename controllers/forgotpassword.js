const path = require('path');
require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Admin = require('../models/admin'); 

const nodemailer=require("nodemailer");

// const randomstring=require("randomstring");




const sendResetPasswordMail = async (name, email, token) => {

    try{

        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            // requireTLS: true,
            auth: {
              user: process.env.USER,
              pass: process.env.APP_PASSWORD,
            },
          });

          const mailOptions = {
           from: process.env.USER,
           to: email,
           subject: `Your Password Reset Token for ${name}`,
           html: '<p>Hello '+name+',</p>'+token+'</p>',
          };


          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
          })


    }catch(err){
        console.log("Error in sending email");
        res.status(400).send("Error in sending email...");
    }
    
}




module.exports = {

    forgotpassword_get: async (req, res) => {
        res.render('forgot');
    },

    forgotpassword_post: async (req, res) => {
        const { email } = req.body;
    
        try {
            const user = await Admin.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            // Generate OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
            // Store OTP in the database with an expiry time (e.g., 2 minutes)
            user.resetPasswordOtp = otp;
            user.resetPasswordOtpExpires = Date.now() + (1 * 60 * 1000); // 2 minutes in milliseconds
            await user.save();
    
            // Send reset password email
            await sendResetPasswordMail(user.name, user.email, otp);
    
            const htmlDocument = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>OTP Verification</title>
                <!-- Bootstrap CSS -->
                <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    /* Custom CSS for OTP form */
                    body {
                        background-color: #f8f9fa;
                        padding: 20px;
                    }
                    .container {
                        max-width: 400px;
                        margin: auto;
                        padding: 30px;
                        background-color: #fff;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        margin-bottom: 30px;
                        text-align: center;
                    }
                    label {
                        font-weight: bold;
                    }
                    input[type="email"],
                    input[type="text"] {
                        width: 100%;
                        padding: 10px;
                        margin-bottom: 20px;
                        border: 1px solid #ced4da;
                        border-radius: 5px;
                    }
                    input[type="submit"] {
                        width: 100%;
                        padding: 10px;
                        background-color: #007bff;
                        border: none;
                        border-radius: 5px;
                        color: #fff;
                        font-size: 16px;
                        cursor: pointer;
                        transition: background-color 0.3s;
                    }
                    input[type="submit"]:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Enter OTP</h1>
                    <form action="/resetpassword" method="post">
                        <div class="form-group">
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" value="${user.email}" readonly class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="otp">OTP:</label>
                            <input type="text" id="otp" name="otp" required class="form-control">
                        </div>
                        <input type="submit" value="Submit" class="btn btn-primary btn-block">
                    </form>
                </div>
            </body>
            </html>
            `;
            

        // Send the HTML document string
        res.send(htmlDocument);
        
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },


resetpassword: async (req, res) => {
    const { email, otp } = req.body;
console.log(email,otp);

    const user = await Admin.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: 'Invalid email' });
    }

    if (user.resetPasswordOtp !== otp || user.resetPasswordOtpExpires < Date.now()) {

        const message = 'You Entered Wrong OTP or OTP Expired';

        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <!-- Bootstrap CSS -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        /* Custom CSS for OTP form */
        body {
            background-color: #f8f9fa;
            padding: 20px;
        }
        .container {
            max-width: 400px;
            margin: auto;
            padding: 30px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            margin-bottom: 30px;
            text-align: center;
        }
        label {
            font-weight: bold;
        }
        input[type="email"],
        input[type="text"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #ced4da;
            border-radius: 5px;
        }
        input[type="submit"] {
            width: 100%;
            padding: 10px;
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        input[type="submit"]:hover {
            background-color: #0056b3;
        }
        .error-message {
            color: red;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Enter OTP</h1>
        <form action="/resetpassword" method="post">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" value="${user.email}" readonly class="form-control">
            </div>
            <div class="form-group">
                <label for="otp">OTP:</label>
                <input type="text" id="otp" name="otp" required class="form-control">
            </div>
            <input type="submit" value="Submit" class="btn btn-primary btn-block">
        </form>
        <p class="error-message">${message}</p>
    </div>
</body>
</html>
`;

res.send(htmlContent.replace('${message}', message));

        // return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    res.render('resetpassword', { email });

},

updatePassword: async (req, res) => {
    const { email, Password } = req.body;
    console.log(email, Password);

   

    try{

        const hashedPw = await bcrypt.hash(Password, 10);
        let user = await Admin.findOne({ email });

        
    if (user.resetPasswordOtpExpires < Date.now()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }


         user = await Admin.findOneAndUpdate({email : email}, {$set :{password : hashedPw}});
         console.log(user);

        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpires = undefined;
        await user.save();
         
        res.redirect('/googlelogin');

    }catch(e){
        console.log("Error in Confirm Password");
        console.error(e);
        res.status(500).send(`Error in Confirm Password ${e}`);
    }
   
}
    
    
}


         
        