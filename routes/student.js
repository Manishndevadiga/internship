const express=require('express');
const router=express.Router();
// const User=require('../models/user');

const controllers = require('../controllers/studentctl');
const { authenticatedUser } = require('../middlewares/auth');
const { alreadyLoginStd } = require('../middlewares/auth');



router.get('/StuLog', controllers.get);
router.get('/alreadyLogin', alreadyLoginStd , controllers.already);
router.post('/StuLog',controllers.post);
router.get('/addmissionform', controllers.form);
router.post('/addmissionform',controllers.upload)
router.get('/Timetable',authenticatedUser, controllers.timetable);
router.get('/ViewImages',authenticatedUser, controllers.ViewImages);
router.get('/searchfees', controllers.searchfees);
router.post('/searchResult', controllers.searchResult);
router.get('/searchstdinfo', controllers.searcstdinfo);
router.get('/stddataapi', controllers.stddataapi);



module.exports=router;