const express=require('express');
const router=express.Router();


const controllers = require('../controllers/staffctl');
const {  alreadyLoginStaff} = require('../middlewares/auth');

router.get('/stafflogin', controllers.stafflogin);
router.get('/alreadyLoginStaff',  alreadyLoginStaff,controllers.alreadylogin);
router.post('/stafflogin', controllers.staffloginpost);
router.get('/staffregister', controllers.staffregister);
router.post('/staffregister', controllers.staffregisterpost);
router.get('/staffinfo', controllers.staffinfo);
router.post('/update', controllers.update);
router.post('/delete', controllers.delete);

module.exports=router;