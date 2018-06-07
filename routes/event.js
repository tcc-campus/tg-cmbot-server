const express = require('express');
const apiKeyMiddleware = require('apikey');

const router = express.Router();
router.use(apiKeyMiddleware((key, fn) => {
  if (key === process.env.INTERNAL_API_KEY) {
    fn(null, true);
  } else {
    fn(null, null);
  }
}, 'x-api-key'));

const enHandler = require('../handlers/eventNotificationHandler');
const attService = require('../services/attendanceService');
const evtService = require('../services/eventService');

router.post('/', (req, res) => {
  const eventObj = req.body;
  console.log('received event request:', JSON.stringify(eventObj));

  setTimeout(() => {
    res.status(200).send('All Good');
  }, 3000);
});

router.post('/notify', (req, res) => {
  const eventNotification = req.body;
  console.log('Received event notification from bot platform: ', JSON.stringify(eventNotification));
  try {
    enHandler.handleEventNotification(eventNotification);
    res.status(200).send('Received event notification and sent to subscribers');
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/attendance', (req, res) => {
  const attendancePoll = req.body;
  console.log('Received Event Attendance Object:', JSON.stringify(attendancePoll));
  try {
    if (attService.isAttendancePollValid(attendancePoll)) {
      attService.broadcastAttendanceMessage(attendancePoll);
      res.status(200).send('Received event attendance object. Sending to subscribers');
    } else {
      res.status(500).send('Failed to send event attendance to subscribers');
    }
  } catch (error) {
    console.log(error.toString());
    res.status(500).send(error.toString());
  }
});

router.get('/all', async (req, res) => {
  console.log('Received request to get all events');
  try {
    const eventList = await evtService.getAll();
    res.status(200).json(eventList);
  } catch (error) {
    console.log(error.toString());
    res.status(500).send(error.toString());
  }
});

module.exports = router;
