const express=require('express');
const router=express.Router();
// const User=require('../models/user');

const home = require('../controllers/home.js');

router.get('/', home.get);


module.exports=router;