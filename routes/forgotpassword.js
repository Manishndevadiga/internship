const express=require('express');
const router=express.Router();
// const User=require('../models/user');

const controllers = require('../controllers/forgotpassword.js');

router.get('/forgotpassword', controllers.forgotpassword_get);

router.post('/forgotpassword_post', controllers.forgotpassword_post);

router.post('/resetpassword', controllers.resetpassword);

 router.post('/updatePasswordPost', controllers.updatePassword);

// router.post('/updatePasswordPost', controllers.updatePasswordPost);



module.exports=router;