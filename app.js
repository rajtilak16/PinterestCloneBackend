var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressSession = require('express-session');
const dbConnection = require("./config/db");
const user = require("./models/user");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const passport = require('passport');

var app = express();
app.set('view engine', 'ejs');
dbConnection();

app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: 'secret',
}))
app.use(passport.initialize());
app.use(passport.session()) // persistent login sessions
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
