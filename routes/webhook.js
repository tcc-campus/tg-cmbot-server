const express = require('express');
const request = require('request');
const config = require('../config');
const ev_handler = require('../handlers/event_handler');
var router = express.Router();

// Receive Events from Telegram
router.post('/', function(req, res) {
  const eventObj = req.body;
  console.log('received event from telegram:', JSON.stringify(eventObj));
  ev_handler.handleEvent(eventObj);

  setTimeout(() => {
    res.status(200).send('All Good');
  }, 3000);
});

module.exports = router;
