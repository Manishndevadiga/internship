const path = require('path');
const Students = require('../models/student'); 
const {setuser}=require('../service/auth');

module.exports = {
    get: (req, res) => {
        // Serve the login.html file
        res.render("student_login", {
            errorMessage: 0,
          });
    },

    already: (req, res) => {
      console.log(req.user);
      const name=req.user.name;
      res.render("StudentDashboard", {
        errorMessage: 0,name:name
      });
    },
    
    post: async (req, res) => {
        const { usn,dob} = req.body;
        console.log(usn,dob);
      
        if (!usn || !dob) {
          res.render("student_login", {
            errorMessage: "Please enter both USN and DOB.",
          });
          return;
        }
      
        try {
      
          const user = await Students.findOne({ usn,dob });  //.findOne({ $or: [ { usn }, { dob } ] })
          if (!user) {
            res.render("student_login", {
              errorMessage: "Invalid USN or DOB. Please try again.",
            });
            }
        else{

              const token=setuser(user);
              res.cookie('tokenname',token);

          res.render('StudentDashboard', {name:user.name}); // Redirect to the dashboard or any other authenticated route
          } 
        } catch (err) {
          
          console.log(err);
          res.render("student_login", {
            errorMessage:
            "User creation encountered an issue. Please verify credentials.",
          }); 
        }
      },
      form: (req, res) => {
        res.render('Addmissionform');
     },
     upload: async (req, res) => {
        let formData = req.body;

        const {firstname,lastname,fathername,mothername,birthday,email,gender,phonenumber,religion,nationality,presentaddress,permanentaddress,usn,branch,feesState,feespaid,feesdue,selecteddate}=req.body;
       
       console.log(firstname,lastname,fathername,mothername,birthday,email,gender,phonenumber,religion,nationality,presentaddress,permanentaddress,usn,branch,feesState,feespaid,feesdue,selecteddate);
       
         try {
       
           const newStd = new Students({
             name:firstname,
             lname:lastname,
             fatherName:fathername,
             motherName:mothername,
             dob:birthday,
             email:email,
             gender:gender,
             phone:phonenumber,
             religion:religion,
             nationality:nationality,
             presentAddress:presentaddress,
             permanentAddress:permanentaddress,
             usn:usn,
             branch:branch,
             feesState:feesState,
             feespaid:feespaid,
             feesdue:feesdue,
             selecteddate:selecteddate,
           });
       
           // Save the newStd instance to the database
           const createdUser = await newStd.save();
       
           res.send("New Student Added successfully... ");
         } catch (err) {
           console.log(err);
           res.render("Addmissionform");
         }
       },
       timetable: (req, res) => {
        res.render("timetable");
    },
    ViewImages: (req, res) => {
      res.render('ViewImages', {
        images : [], message: null ,
      });
  },

  searchfees: (req, res) => {
    res.render('searchstd', { data:[] });
  },

  searchResult: async (req, res) => {
      const searchTerm = req.body.searchTerm;

      console.log(searchTerm);
    
      try {
        // Perform the search based on your model and criteria
        const searchData = await Students.find({ name: { $regex: searchTerm, $options: 'i' } });
        console.log(searchData);
    
        res.render('searchstd', { data: searchData });
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error..😒');
      }
    },


    searcstdinfo: async function (req, res, next) {
  try{
    const students = await Students.find();
    console.log(students);
    res.render('searchstd_info', {students}); 
  }catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
   }
 },

 
 stddataapi: async function (req, res, next) {
  try{
    const students = await Students.find();
    if (!students){
      return res.status(404).json({msg: "No student data found"});
    }else{
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST');
       return res.status(200).json(students);
    }
  }catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
},

};