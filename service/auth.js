const jwt=require('jsonwebtoken');
const TOKEN_SECRET="manish";


 function setuser(user){
    return jwt.sign({
        _id:user._id,
        email: user.email,
        role:user.role,
        name:user.name
    },TOKEN_SECRET);
}

 function getuser(token){
    return jwt.verify(token,TOKEN_SECRET);
}

module.exports={
    setuser,
    getuser
}; 

// module.exports=(req,res,next)=>{
//     const token=req.header('auth-token');
//     if(!token) return res.status(401).send('Access Denied');
//     try{
//         const verified=jwt.verify(token,process.env.TOKEN_SECRET);
//         req.user=verified;
//         next();
//     }
//     catch(err){
//         res.status(400).send('Invalid Token');
//     }
// }