const express = require ("express");
const flash = require ("connect-flash");
const session = require ("express-session");
const passport = require ("passport");
const expressLayouts = require('express-ejs-layouts');
const mongoose = require ("mongoose");

const app = express();

//PASSOPRT CONFIG
require("./config/passport")(passport);

//DB CONFIG
const db = require ('./config/keys').MongoURI;

//CONNECT to MONGODB
mongoose.connect (db, { useNewUrlParser: true })
.then (()=> console.log ("Mongo DB Connected"))
.catch (err => console.log (err));

//BODY PARSER
app.use(express.urlencoded({extended: false}));
//EXPRESS SESSION MIDDLEWARE
app.use(session({
  secret: 'secret', // does not matter what is this.
  resave: true,
  saveUninitialized: true,
}));


//PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

//CONNECT flash
app.use(flash());

//GLOBAL VARIABLE - PIECE of CUSTOMIZED MIDDLEWARE
app.use((req,res, next)=>{
res.locals.success_msg = req.flash("success_msg");
res.locals.error_msg = req.flash("error_msg");
res.locals.error = req.flash("error");   // Basically I have added this..
next();
});

//EJS MIDDLEWARE
app.use(expressLayouts);
app.set('view engine', 'ejs');

//ROUTES
app.use ("/", require ("./routes/index"));
app.use ("/users", require ("./routes/users"));


const PORT = process.env.PORT || 5000;
app.listen (PORT, console.log (`Server started on port ${PORT}`));
