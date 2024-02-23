const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const studentSchema=new Schema({
    name: {
        type: String,
        // required: true,
      },
      lname: {
        type: String,
        // required: true,
      },
      dob: {
        type: Date,
        // required: true,
      },
      gender: {
        type: String,
        enum: ['male', 'female'],
        // required: true,
      },
      email: {
        type: String,
        unique: true,
        // required: true,
        // Add a custom validation for email format using a regular expression
        match: [/\S+@gmail\.com$/, "Please enter a valid Gmail address"],
      },
    
      phone: {
        type: Number,
        // required: true,
        // validate: {
        //   validator: function(v) {
        //     // Ensure that the phone number has exactly 10 digits
        //     return /^\d{10}$/.test(v);
        //   },
        //   message: 'Please enter a valid 10-digit phone number',
        // }
      },
    
      fatherName:{
          type: String,
          required: true,
        },
        motherName :{
          type: String,
          required: true,
        },
    
        religion:{
          type:String,
          required:true,
        },
        presentAddress:{
          type:String,
          required:true,
        },
        permanentAddress:{
          type:String,
          required:true,
        },
        nationality:{
          type:String,
          required:true,
        },
        usn:{
          type:String,
        },
        branch:{
          type:String,
          required:true,
        },
        feespaid:{
          type:String,
        },
        feesdue:{
          type:String,
        },
        feesState:{
          type:String,
        },
        selecteddate:{
          type:Date,
          default:Date.now,
        },
        role: {
          type: String,
          default: "Student",
        }
      });


const student=mongoose.model('User', studentSchema);

module.exports=student;