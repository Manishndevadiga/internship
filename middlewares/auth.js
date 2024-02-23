const {getuser}=require('../service/auth.js');


function authenticatedUser(req,res,next){
   
    const token=req.cookies.tokenname;

    if(!token) return res.status(401).send('Access Denied');

        const user=getuser(token);
        req.user=user;
        console.log("this is the middleware");
        console.log(user);
        next();
}

function alreadyLoginStd(req,res,next){
   
    const token=req.cookies.tokenname;

    if(!token)  return res.render('errorpage.ejs', { errorMessage: 'Please sign in to access your account' });

        const user=getuser(token);
        req.user=user;
        if(user.role ==='Student'){
            return next();
        }else{
             return res.render('errorpage.ejs', { errorMessage: 'Your role is Staff login as Student,' });
        }
}

function alreadyLoginStaff(req,res,next){
   
    const token=req.cookies.tokenname;

    if(!token)  return res.render('errorpage.ejs', { errorMessage: 'Please sign in to access your account' });

        const user=getuser(token);
        if(user.role ==='Staff'){
            req.user=user;
            return next();
        }else{
             return res.render('errorpage.ejs', { errorMessage: 'Now Your role is Student , login as Staff' });
        }
}

module.exports={
    authenticatedUser,
    alreadyLoginStd,
    alreadyLoginStaff
};