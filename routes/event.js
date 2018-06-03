const express = require('express');
const apiKeyMiddleware = require('apikey');

var router = express.Router();
router.use(apiKeyMiddleware(function(key, fn) {
  if(key === process.env.INTERNAL_API_KEY) {
    fn(null, true)
  } else {
    fn(null, null)
  }
}, 'x-api-key'));

const enHandler = require('../handlers/eventNotificationHandler');
const attService = require('../services/attendanceService');

router.post('/', function(req, res) {
  const eventObj = req.body;
  console.log('received event request:', JSON.stringify(eventObj));

  setTimeout(() => {
    res.status(200).send('All Good');
  }, 3000);
});

router.post('/notify', function(req, res) {
  const eventNotification = req.body;
  console.log('Received event notification from bot platform: ', JSON.stringify(eventNotification));
  enHandler.handleEventNotification(eventNotification).then((result) => {
    res.status(200).send('Received event notification and sent to subscribers')
  }).catch((error) => {
    res.status(500).send(error);
  })
})

router.post('/attendance', function(req, res) {
  const eventAttendance = req.body;
  console.log('Received Event Attendance Object:', JSON.stringify(eventAttendance));
  try {
    if (attService.isAttendanceObjValid(eventAttendance)) {
      attService.broadcastAttendanceMessage(eventAttendance);
      res.status(200).send('Received event attendance object. Sending to subscribers')
    } else {
      res.status(500).send('Failed to send event attendance to subscribers');
    }
  } catch (error) {
    console.log(error.toString());
    res.status(500).send(error.toString());
  }
})

module.exports = router;
