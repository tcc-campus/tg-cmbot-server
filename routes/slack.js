const express = require('express');

const config = require('../config');
const slCaller = require('../apiCallers/slackCaller');
const sService = require('../services/slackService');
const evtService = require('../services/eventService');
const sbService = require('../services/subscriptionService');
const attService = require('../services/attendanceService');

const router = express.Router();

function isAuthorized(token, teamId) {
  return token === config.SLACK_APP_TOKEN && teamId === config.SLACK_TEAM_ID;
}

router.post('/commands/add-event', (req, res) => {
  const commandObj = req.body;
  console.log('Received add event command event from slack: ', JSON.stringify(commandObj));
  if (isAuthorized(commandObj.token, commandObj.team_id)) {
    sService.sendAddEventForm(commandObj);
    res.status(200).send('Success');
  } else {
    res.status(403).send('Invalid token');
  }
});

router.post('/commands/update-cache', async (req, res) => {
  const commandObj = req.body;
  let responseMsg = '';
  console.log('Received update cache command event from slack: ', JSON.stringify(commandObj));
  if (isAuthorized(commandObj.token, commandObj.team_id)) {
    try {
      res.status(200).send('Cache is being updated...');
      await Promise.all([
        evtService.setAll(),
        sbService.setSectionCellList(),
        attService.cacheAttendancePollList(),
      ]);
      responseMsg = 'Cache has been successfully updated!';
    } catch (error) {
      responseMsg = 'Cache not updated successfully.';
    } finally {
      await slCaller.respondToSlackCommand(commandObj.response_url, responseMsg);
    }
  } else {
    res.status(403).send('Invalid token');
  }
});

router.post('/interactive', (req, res) => {
  const interactiveObj = JSON.parse(req.body.payload);
  console.log('Received interactive event from slack: ', JSON.stringify(interactiveObj));
  if (isAuthorized(interactiveObj.token, interactiveObj.team.id)) {
    // sService.sendAddEventForm(commandObj);
    res.status(200).send('Success');
  } else {
    res.status(403).send('Invalid token');
  }
});

module.exports = router;
