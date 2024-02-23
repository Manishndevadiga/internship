const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const  adminscheema=new Schema({
    username:{
        type:String,
        required:true
    },
    name: {
        type: String,
        required: true,
    },
    email:{
        type:String,
        unique:true,
    } ,
   password :{
       type:String,
       required:true,
   },
   phonenumber:{
       type:Number,
   },
   token:{
       type:String,
       default:'',
   },
   resetPasswordOtp: {
    type: String
},
resetPasswordOtpExpires: {
    type: Date
}
});


const Admin = mongoose.model("Admin", adminscheema);

module.exports = Admin;