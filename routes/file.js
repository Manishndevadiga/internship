const express=require('express');
const router=express.Router();

const controllers = require('../controllers/file');

router.get('/fileWrite', controllers.fileWrite);

router.post('/fileWritePost', controllers.fileWritePost);

router.get('/fileRead', controllers.fileRead);

router.post('/DeleteComment', controllers.DeleteComment);

router.get('/fileReadStd', controllers.fileReadStd);

module.exports=router;