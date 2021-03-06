const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const request = require('request');

const index = require('./routes/index');
const webhook = require('./routes/webhook');
const event = require('./routes/event');
const slack = require('./routes/slack');
const cell = require('./routes/cell');

const tgCaller = require('./apiCallers/telegramCaller');
const config = require('./config');
const cacheProvider = require('./cache/cacheProvider');
const cronSetup = require('./crons/cronSetup');
const attService = require('./services/attendanceService');
const evtService = require('./services/eventService');
const sbService = require('./services/subscriptionService');

const app = express();

app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', index);
app.use(`/bot${config.BOT_TOKEN}`, webhook);
app.use('/cell', cell);
app.use('/event', event);
app.use('/slack', slack);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  const response = res;
  response.locals.message = err.message;
  response.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  response.status(err.status || 500);
  response.send('error');
});

async function init() {
  try {
    // start cache provider
    cacheProvider.start();

    // set Telegram Webhook
    await tgCaller.setWebHook();

    // Start Push notification cron job
    cronSetup.startPNCronJob();

    // Set all events in cache
    evtService.setAll();

    // Set all cells in cache
    sbService.setSectionCellList();

    // Set all attendance polls in cache
    attService.cacheAttendancePollList();
  } catch (error) {
    console.log(error);
  }
}

init();

// prevent timeout
setInterval(() => {
  request.get(process.env.PUBLIC_URL);
}, 10 * 60 * 1000);

module.exports = app;
