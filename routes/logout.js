const express=require('express');
const router=express.Router();
// const User=require('../models/user');

const controllers = require('../controllers/logout');

router.get('/logout', controllers.logout);

module.exports=router;