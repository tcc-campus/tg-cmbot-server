var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
// var webhook = require('./routes/webhook');
var tg_caller = require('./api_callers/telegram_caller');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
// app.use('/webhook', webhook);

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
  res.render('error');
});

// setup telegram WebHook

// Telegraf setup
// const TG_BOT_TOKEN = process.env.BOT_TOKEN
// const URL = `${process.env.PUBLIC_URL}/bot${TG_BOT_TOKEN}`;
//
// const bot = new Telegraf(TG_BOT_TOKEN)
// bot.telegram.setWebHook(URL);
// bot.startWebHook(`/bot${TG_BOT_TOKEN}`, null, 3000);
tg_caller.set_webhook().then((result) => {
  console.log(result);
}).catch((error) => {
  console.log(error);
});

module.exports = app;
