var express = require('express');
var logger = require('morgan');
var path = require('path');
var api = require('./api');
var app = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'app')));
app.use('/api', api);

app.listen('3000');

module.exports = app;
