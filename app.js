var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./api/index');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);
app.use(function(req, res, next) {
  res.status(404).json({code: 404, msg: 'Not found'});
});

app.use(function(err, req, res, next) {
  console.log(err.stack);
  res.status(500).json({code: 404, msg: err.message});
});

module.exports = app;
