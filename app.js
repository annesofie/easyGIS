var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
//var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


//Mongoose, open a connectin to easygis1 database
mongoose.connect('mongodb://localhost/easygis1');
var kitty = require('./models/kitty.js')

//Notifies if we connect successfully
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('Connected to easygis1');
});


/*
var fluffy = kitty.create( { name: 'Fluffy' })

silence.save(function(err, silence) {
  if(err) return console.error(err);
  else {
    console.log('silence added to easygis1');
  }
  silence.speak;
});
fluffy.save(function(err, fluffy) {
  if(err) return console.error(err);
  else {
    console.log('fluffy added to easygis1');
  }
  fluffy.speak;
}) */



var app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
});


module.exports = app;

var silence = kitty.create( { name: 'Fluffy' }, function(err, silence) {
  if(err) return console.error(err);
  console.log('silence added to easygis1');
});

kitty.find({ name: 'Fluffy'}, function (err, kittens) {
  if (err) return console.error(err);
  for (i=0; i<kittens.length; i++) {
    console.log(kittens[i].name);
  }
})


