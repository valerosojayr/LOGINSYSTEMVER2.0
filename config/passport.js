

const LocalStrategy = require ("passport-local").Strategy;
const mongoose = require ("mongoose");
const bcrypt = require ("bcryptjs");
const passport = require ("passport");

//Load User Model
const User = require ("../models/User");


module.exports = function (){
  passport.use(
    new LocalStrategy({ usernameField: "email"},(email,password, done)=>{
        //Match USER
        User.findOne({email:email})

        .then(user=>{
            if(!user){
              return done (null,false, {messge: "That email is not registered"});
            }
            //Match password
            bcrypt.compare(password, user.password, (err, isMatch)=>{
              if (err) throw err;
              if (isMatch){
                return done (null, user);
              }
              else {
                return done(null, false, {message: "Password incorrect"})
              }
            });


        }) // End of .then promise


        .catch({

        })

    }) // End Tag for new LocalStrategy
  );  // End Tag for passport.use



  //UPDATED SERIALIZEUSER AND DESERIALIZE USER
  passport.serializeUser((user, done)=> {
    done(null, user.id);
  });

  passport.deserializeUser((id, done)=> {
    User.findById(id, (err, user)=> {
      done(err, user);
    });
  });

}; //  End Tag for module.exports
