const express = require('express');
const request = require('request');
const config = require('../config');
var router = express.Router();

// Receive Events from Bot Platform
router.post('/', function(req, res) {
  const eventObj = req.body;
  console.log('received event from bot platform:', JSON.stringify(eventObj));

  setTimeout(() => {
    res.status(200).send('All Good');
  }, 3000);
});

router.post('/notify-event', function(req, res) {
  const eventNotification = req.body;
  console.log('Received event notification from bot platform: ', JSON.stringify(eventNotification));

  res.status(200).send('Received event notification and sent to subscribers')
})

module.exports = router;
