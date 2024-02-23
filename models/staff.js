const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const  staffscheema=new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    // Add a custom validation for email format using a regular expression
    match: [/\S+@gmail\.com$/, "Please enter a valid Gmail address"],
  },
  password: {
    type: String,
    required: true,
    minlength: 1,
  }, 
  subject:{
    type: String,
  },
  
  role: {
    type: String,
    default: "Staff",
  }
});

const Staffs = mongoose.model("Staffs", staffscheema);

// Export each schema and model individually
module.exports = Staffs;
