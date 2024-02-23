const express=require('express');
const app=express();
const path=require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();




///////////////////////////

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const callbackURL = process.env.CALL_BACK_URL;


const session=require('express-session');
const MongoStore=require('connect-mongo');
const passport=require('passport');
const GoogleStrategy=require('passport-google-oauth20').Strategy;



///////////////////////////


const mongoose = require('mongoose'); 


const { connectMongoDB } = require('./connection'); 
const mongoURI = process.env.MONGODB_URI;
connectMongoDB(mongoURI);

const sessionStorage = MongoStore.create({
  mongoUrl:mongoURI,
  dbName: 'test',
  collectionName: 'sessions',
  ttl: 14 * 24 * 60 * 60, // store for 14 days (in seconds)
  autoRemove: 'native',
  mongooseConnection: mongoose.connection,
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());


///////////////////////////

app.use(session({
  secret: 'key',
  cookie: {
      maxAge: 604800, 
  },
  resave: false,
  saveUninitialized: false,
  name: 'manish'
}))

app.use(passport.initialize());
app.use(passport.session());  //only use if we use express-session..

passport.use(new GoogleStrategy({
  clientID:clientID,
  clientSecret:clientSecret,
  callbackURL:callbackURL 
},

function(accessToken,refreshToken,profile,cb){
      console.log(profile);
      console.log(accessToken,refreshToken);
      cb(null,profile);
      //The function cb(null, profile) is used to signal the completion of the authentication process 
      //and provide Passport.js with the user's profile information for serialization
  }
));

passport.serializeUser(function(user,cb){
  cb(null,user);
});

passport.deserializeUser(function(obj,cb){
  cb(null,obj);
});

///////////////////////////


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true })); 
//when request is urlencoded we use this middleware to parse it and put the data in req.body
app.use(bodyParser.json()); // to support JSON-encoded bodies

app.use(cors());

app.use(express.json()); 
// when request is json we use this middleware to parse it and put the data in req.body. we can use also this instead of app.use(bodyParser.json()); 

const student=require('./routes/student');
app.use('/',student);

const home=require('./routes/home');
app.use('/',home);

const admin=require('./routes/admin');
app.use('/',admin);

const staff=require('./routes/staff');
app.use('/',staff);

const files=require('./routes/file');
app.use('/',files);

const logout=require('./routes/logout');
app.use('/',logout);

const forgotpassword=require('./routes/forgotpassword');
app.use('/',forgotpassword);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





