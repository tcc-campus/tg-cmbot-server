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

const sbService = require('../services/subscriptionService');

router.get('/member-list', async (req, res) => {
  console.log('Received request to get all cell member list');
  try {
    const cellMemberList = await sbService.getCellMemberList();
    res.status(200).json(cellMemberList);
  } catch (error) {
    console.log(error.toString());
    res.status(500).send(error.toString());
  }
});

module.exports = router;
