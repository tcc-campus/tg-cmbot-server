const express = require('express');
const evtHandler = require('../handlers/eventHandler');

const router = express.Router();

// Receive Events from Telegram
router.post('/', (req, res) => {
  const eventObj = req.body;
  console.log('received event from telegram:', JSON.stringify(eventObj));
  evtHandler.handleTgEvent(eventObj);

  setTimeout(() => {
    res.status(200).send('All Good');
  }, 1000);
});

module.exports = router;
