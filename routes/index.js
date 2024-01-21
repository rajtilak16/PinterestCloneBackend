var express = require('express');
const userModel = require('../models/user');
const postModel = require('../models/post');
const passport = require('passport');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));
const upload = require('./multer')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  // res.send("Welcome BABA")
});

router.get('/login', function(req, res, next) {
  // console.log(req.flash("error"));
  res.render('login', { error: req.flash('error') });
});

router.get('/profile', isLoggedin, async function(req, res, next){
  const user = await userModel.findOne({
    username: req.session.passport.user
  }).populate("posts");
  res.render("profile",{user})
})

router.post('/upload', upload.single('file'), async function(req,res){
  if(!req.file){
    return res.status(400).send("no files were given");
  }
  // res.send('File uploaded Successfully')

  const user = await userModel.findOne({username: req.session.passport.user });
  const postData = await postModel.create({
    imageUrl: req.file.filename,
    caption: req.body.caption,
    user: user._id,
  })
  user.posts.push(postData._id);
  await user.save();
  res.redirect("/profile");
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
  failureFlash: true,
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
