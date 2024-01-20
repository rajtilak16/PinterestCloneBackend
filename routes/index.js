var express = require('express');
const userModel = require('../models/user');
const passport = require('passport');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  // res.send("Welcome BABA")
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/profile', isLoggedin, function(req, res, next){
  res.render("profile")
})

router.get('/forgot', function(req,res){
  res.send("Bitch")
})

router.get('/feed', isLoggedin, function(req,res){
  res.render("feed");
})

router.post('/register',async function(req,res){
  const {username, email, fullname} = req.body;
  const userData = new userModel({ username, email, fullName: fullname});

  userModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate('local')(req, res, function(){
      console.log("User has been registered");
      res.redirect('/profile');
    })
  })
  .catch((err) => {
    console.log(err);
  })  
})

router.post('/login', passport.authenticate('local',{
  successRedirect: '/profile',
  failureRedirect: '/login',
}), function(req,res){

})

router.get('/logout', function(req,res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedin(req, res, next) {
  if(req.isAuthenticated()) return next();
  res.redirect('/login');
}
module.exports = router;
