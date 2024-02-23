const path = require('path');
const express = require('express');
const fs=require('fs');
var ejs=require("ejs");
const puppeteer = require('puppeteer');
const bcrypt = require('bcrypt');

const Admin = require('../models/admin'); 


const puppeteerConfig = require('../puppeteer.config.cjs');
const cacheDirectory = puppeteerConfig.cacheDirectory;


const cldImage = require('../models/cldimg'); 


module.exports = {

  googlelogin: (req, res) => {
    res.render('googlelogin',{message:[]});
  },

  googledashboard: (req, res) => {
   
    const { email, name, image } = req.query;

    if (email && name && image) {
        console.log(email); // Email address
        console.log(name); // User's name
        console.log(image); // User's image URL

        res.redirect(`/additional?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&image=${encodeURIComponent(image)}`);
    } else {
        console.log('User is not authenticated');
        res.render('googlelogin', { message: 0 });
    }
},


  additional: (req, res) => {
    const { email, name, image } = req.query;
    res.render('additional', { email, name, image });
  },

  registerAdmin: async (req, res) => {

    const { email, name, username, phoneNumber, password } = req.body;

    console.log(email, name, username, phoneNumber, password);
    
try{

     const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = new Admin({
      email,
      name,
      username,
      phoneNumber,
      password: hashedPassword
    });

 const createdAdmin = await newAdmin.save();
 console.log(createdAdmin);

 console.log('Admin registered successfully:');

 res.render("googlelogin",{message:"Admin Registered Successfully"});

 } catch (error) {
  res.render("googlelogin",{message:"Account already exists. Please try with different credentials."});
}

},

  adminloginpost: async (req, res) => {
    let userEmail=req.body.email;
    let userPass=req.body.password;
  
    //check if the user is in database or not
    const user = await Admin.findOne({ email : userEmail });
    if (!user){
        return res.render("googlelogin",{message:"User Not Found!"});
    }

    //compare the entered password with the stored one
    const validPass = await bcrypt.compare(userPass , user.password);
    if(!validPass) return res.render("googlelogin",{message:"Incorrect Password"});

    
    res.redirect("/Admindashboard");
  },


  googlelogout: (req, res) => {
    req.logout(function (err) {
      if (err) 
      { 
          console.log(err); 
      }else{
          res.clearCookie('connect.sid');
          res.redirect('/googlelogin');
      }
    });
  },

    get: (req, res) => {
       res.render('AdminDashboard');
    },

    CloudinaryForm: (req, res) => {
        res.render('cloudinary');
    },


    get_image: async (req, res) => {
        const unqname = req.body.search;

  try {
 
    if (!unqname) {
      return res.render("ViewImages", { images: [], message: 'No search input provided' });
    }
    // unqname: unqname
    const images = await cldImage.find({ unqname: { $regex:  unqname, $options: 'i' } });
    console.log(unqname);

    if (images.length === 0) {
      // Render the same page with a message
      return res.render("ViewImages", { images: [], message: 'No results found for the search' });
    }
    console.log(unqname);
    res.render("ViewImages", { images, message: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
   },

   getAllImages: async (req, res) => {

    try{

    const images = await cldImage.find();

    if (images.length === 0) {
      // Render the same page with a message
      return res.render("ViewImages", { images: [], message: 'No results found for the search' });
    }
    
    res.render("ViewImages", { images, message: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

},



   maindemo: (req, res) => {
    res.render('demo');
   },



   certificate_generate: async (req, res) => {
    console.log(req.body);

    const {additionalData} = req.body;
    let templatePath;
  
    if(additionalData === "sports") {
      var {name, date, signature, event} = req.body;
      templatePath = path.join(__dirname, '../views/certificates/sports_crtf.ejs');
    } else if(additionalData === "general") {
      var {name, date, event} = req.body;
      templatePath = path.join(__dirname, '../views/certificates/general_crtf.ejs');
    } else {
      var {name, date, USN, signature, event} = req.body;
      templatePath = path.join(__dirname, '../views/certificates/edu_crtf.ejs');
    }
  
    try {
      // Read the EJS template
      const template = fs.readFileSync(templatePath, 'utf8');
  
      // User-submitted data
      const userData = {
        name,
        date,
        signature,
        event,
        USN
      };
  
      // Render EJS template with user data
      const html = ejs.render(template, userData);

      // Use Puppeteer to generate PDF
      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();
      await page.emulateMediaType('screen');
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, landscape: true });
      await browser.close();
  
      // Send the PDF as a response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename = certificate.pdf');
      res.send(pdfBuffer);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
  

};
