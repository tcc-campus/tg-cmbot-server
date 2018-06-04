const express = require('express');

const config = require('../config');
const sService = require('../services/slackService');

var router = express.Router();

function isAuthorized(token, teamId) {
  return token === config.SLACK_APP_TOKEN && teamId === config.SLACK_TEAM_ID;
}

router.post('/commands/add-event', function(req, res) {
  const commandObj = req.body;
  console.log('Received command event from slack: ', JSON.stringify(commandObj));
  if(isAuthorized(commandObj.token, commandObj.team_id)) {
    sService.sendAddEventForm(commandObj);
    res.status(200).send('Success')
  } else {
    res.status(403).send('Invalid token');
  }
});

router.post('/interactive', function(req, res) {
  const interactiveObj = JSON.parse(req.body.payload);
  console.log('Received interactive event from slack: ', JSON.stringify(interactiveObj));
  if(isAuthorized(interactiveObj.token, interactiveObj.team.id)) {
    // sService.sendAddEventForm(commandObj);
    res.status(200).send('Success')
  } else {
    res.status(403).send('Invalid token');
  }
});

module.exports = router;
