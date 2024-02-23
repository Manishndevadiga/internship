const express=require('express');
const router=express.Router();
require('dotenv').config();
const passport = require('passport');

const cloudinary = require('cloudinary').v2;
const cldImage = require('../models/cldimg');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

cloudinary.config({
    cloud_name:  process.env.CLOUD_NAME,
    api_key:  process.env.API_KEY,
    api_secret:  process.env.API_SECRET
});


const admin= require('../controllers/adminctl.js');




router.get('/googlelogin', admin.googlelogin);

router.get('/auth/google',passport.authenticate('google',{
  scope:['profile','email']
}));

router.get('/googledashboard', admin.googledashboard);

// google callback url
router.get('/auth/google/callback',passport.authenticate('google',{
  failureRedirect:'/googlelogin'}),async (req,res) => {
    
    const { emails, displayName, photos } = req.user;
    const email = emails[0].value; // Assuming there's only one email address
    const name = displayName || `${req.user.name.givenName} ${req.user.name.familyName}`;
    const image = photos && photos.length > 0 ? photos[0].value : null;

    // Redirect with query parameters
    res.redirect(`/googledashboard?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&image=${encodeURIComponent(image)}`);
});


router.post('/adminloginpost', admin.adminloginpost);

router.get('/googlelogout', admin.googlelogout);

router.get('/additional',admin.additional);

router.post('/register-admin',admin.registerAdmin);

router.get('/Admindashboard', admin.get);

router.get('/CloudinaryForm', admin.CloudinaryForm);

router.get('/demo', admin.maindemo);

router.post('/get_image', admin.get_image);

router.get('/getAllImages', admin.getAllImages);

router.post('/certificate_generate', admin.certificate_generate);

router.get('/loadContent', (req, res) => {
  const category = req.query.category;
  res.render(`partials/${category}`, {}, (err, html) => {
      if (err) {
          res.status(500).send('Error loading content');
      } else {
          res.send(html);
      }
  });
});

router.post("/UploadCloudinary", upload, async (req, res) => {

  const name=req.body.name;
  const imageName = req.file ? req.file.originalname : undefined;

  try {

    if (!name || !imageName) {
      // Render the same page with an error message or form validation
     return res.redirect('/cloudinaryForm');
    }

    // console.log(req.body);
    const result =  await cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      async (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

         // Create a new instance of the Mongoose model
         const newCldImage = new cldImage({
          unqname:name,
          name: imageName,
          imageUrl: result.secure_url,
        });

        console.log(imageName);
      console.log(result.secure_url);

        // Save the new image to the database
        await newCldImage.save();


        res.render('upload_confirm');
      }
    ).end(req.file.buffer);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports=router;