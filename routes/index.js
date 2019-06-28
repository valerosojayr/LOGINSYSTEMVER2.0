const express = require ("express");
const router = express.Router();
const {ensureAuthenticated} = require ("../config/auth");

//HOME PAGE ROUTE
//router.get('/', (req, res) => {
//    res.send('Welcome');
//});


//HOME PAGE ROUTE - RENDER to LOGIN.EJS VIEW
router.get('/', (req, res) => {
    res.render('login');
});




//DASH BOARD
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard',{
      name:req.user.name
    });
});


module.exports = router;
