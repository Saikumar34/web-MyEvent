var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors  = require('cors');
var router = require('./routes/route');
var session = require("express-session");
var connectflash = require("connect-flash");

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
  secret: 'shh',
  resave: true,
  saveUninitialized: true
}));
app.use(connectflash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
// Mongo db connection 
mongoose.connect('mongodb://localhost:27017/express_project');
var db = mongoose.connection;
db.on('connected',()=>{
  console.log("Successfully connected to mongodb");
});

db.on('error',(err)=>{
  console.log("error in connecting to mongodb: " + err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
