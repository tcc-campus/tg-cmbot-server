const express = require('express');
const request = require('request');
const config = require('../config');

var router = express.Router();

// Receive Updates from Telegram
router.post('/', function(req, res) {
  console.log('received update from telegram:', JSON.stringify(req.body));
});

module.exports = router;
