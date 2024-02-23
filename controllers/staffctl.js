const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {setuser}=require('../service/auth');

// const jwtSecret = process.env.JWT_SECRET;


const Staffs = require('../models/staff'); 
const Students = require('../models/student'); 


module.exports = {

  update: async function (req, res) {
    try {
        const { id,name, email, role,subject } = req.body;
        
        console.log(id);
        console.log(name);
        console.log(email);
        console.log(role);
        console.log(subject);
      
        const updatedStudent = await Staffs.updateOne({ _id: id }, { $set: {
            subject: subject,
            name: name,
            email: email,
            role: role,
        } });
      
        res.send(updatedStudent);
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).send('Error updating student');
    }
},



  delete: async function (req, res) {
      // const name = req.query.name;
      const id= req.body.id;
      const age = req.body.age;
      console.log("the name i want to delete is "+ id);
      
      
      const dltusers = await Staffs.findOneAndDelete({ _id: id });
      res.send(dltusers);
  },

  staffregister: (req, res) => {
   res.render('staff_register', {
     errorMessage: 0
   })
  },

  staffregisterpost: async (req, res) => {
    console.log(req.body);
    const { name, email, password ,subject} = req.body;
  
    console.log(subject);

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      // Use the new keyword to create a new Student instance
      const newStaff = new Staffs({
        name: name,
        email: email,
        subject:subject,
        password: hashedPassword,
      });
  
      // Save the newStudent instance to the database
      const createdUser = await newStaff.save();
      console.log(createdUser);
  
      res.redirect("/stafflogin");
    } catch (err) {
      console.log(err);
      res.render("staff_register", {
        errorMessage:
        "User creation encountered an issue. <br> Please verify credentials.",
      });
    }
   
  },

    stafflogin: (req, res) => {
        res.render('staff_login', 
            errorMessage= 0)  },

            alreadylogin: async (req, res) => {

              try {
                const name=req.user.name;
                const staffCount = await Staffs.countDocuments();
                const studentCount = await Students.countDocuments();
                console.log(staffCount);
                console.log(studentCount);
                res.render('staff_dashboard', { staffCount,studentCount,name });
              } catch (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
              }
           },


            staffloginpost: async (req, res) => {
              const { email, password } = req.body;
          
              try {
                  // Find the user by email
                  const user = await Staffs.findOne({ email });
          
                  if (user) {
                      // Compare the entered password with the hashed password in the database
                      const passwordMatch = await bcrypt.compare(password, user.password);
          
                      if (passwordMatch) {

                        const token=setuser(user);                    
                        res.cookie('tokenname',token);

                        const name=user.name;
                        const staffCount = await Staffs.countDocuments();
                        const studentCount = await Students.countDocuments();

                        res.render('staff_dashboard', { staffCount,studentCount,name });

                      } else {
                          // Passwords do not match
                          res.render("staff_login", {
                              errorMessage: "Invalid email or password. Please try again.",
                          });
                      }
                  } else {
                      // User not found
                      res.render("staff_login", {
                          errorMessage: "User not found. Please check your email or register.",
                      });
                  }
              } catch (error) {
                  // Handle other errors
                  console.error(error);
                  res.render("staff_login", {
                      errorMessage: "An error occurred. Please try again.",
                  });
              }
          },
          
staffinfo:  async function (req, res, next) {
  try{
    const allusers = await Staffs.find();
    res.render('staff_info', {allusers}); 
  }catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
},
            
}