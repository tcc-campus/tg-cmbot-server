var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require("http");

var index = require('./routes/index');
var webhook = require('./routes/webhook');
var platform = require('./routes/platform');

var tgCaller = require('./api_callers/telegram_caller');
var config = require('./config');
let cacheProvider = require('./cache_provider');

var app = express();

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use(`/bot${config.BOT_TOKEN}`, webhook);
app.use(`/platform${config.BOT_TOKEN}`, platform);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

// start cached provider
cacheProvider.start(function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log("Cache provider started");
  }
});

// setup telegram WebHook
tgCaller.setWebHook().then((result) => {
  console.log(result);
}).catch((error) => {
  console.log(error);
});

// prevent timeout
setInterval(function() {
    http.get(process.env.PUBLIC_URL);
}, 600000); //

module.exports = app;
