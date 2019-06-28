const express = require ("express");
const router = express.Router();
const User = require ("../models/User");
const bcrypt = require ("bcryptjs");
const passport = require ("passport");



router.get ( "/login", (req, res)=>{
  res.render("login");
} );

router.get ( "/register", (req, res)=>{
  res.render("register");
} );


router.post("/register", (req, res)=>{

const {name, email, password, password2 } = req.body;

let errors = [];

//Check required fields
if(!name || !email || !password || !password2){
  errors.push({msg: "Please fill in all fields"});
}

//Check if Password Match
if(password !== password2){
  errors.push({msg:"Password do not match"});
}

//Check Password Length
if(password.length<6){
  errors.push({msg: "Password should be at least 6 characters"});
}

//If there is a mistake
if(errors.length>0){
  res.render("register",{
    errors,
    name,
    email,
    password,
    password2
  });
}

//Final Result
else{
  //Validation Passed
  User.findOne({email:email})
  .then(user=>{
    if(user){
      //User Exists
      errors.push({msg:"Email is already registered"});
      res.render("register",{
        errors,
        name,
        email,
        password,
        password2
      });
    }else{
      const newUser = new User ({
          name,
          email,
          password
        });
        //HASH PASSWORD
            bcrypt.genSalt(10,(err, salt)=>{bcrypt.hash(newUser.password,salt, (err, hash)=>{
             if (err)throw err;
             //SET PASWWORD TO HASH
             newUser.password = hash;
             //SAVE USER
             newUser.save()
             .then(user=>{
               req.flash("success_msg", "You are now registered and can log in");
               res.redirect("/users/login");
             })
             .catch(err=>console.log(err));
           })})//





    }
  }); //End Tag for Validation Pass


}//else End Tag


}); // End tag of the Register Handle

//LOGIN HANDLE
router.post("/login", (req, res, next)=>{
 passport.authenticate("local",{
   successRedirect: '/dashboard',
   failureRedirect: "/users/login",
   failureFlash: true
 })(req, res, next);
});

//LOGOUT Handle
router.get ('/logout', (req, res)=>{
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});


module.exports = router;
