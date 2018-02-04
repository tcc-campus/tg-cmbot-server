/* Modules to create and start cron jobs
*   Exported Modules:
*     1. startPNCronJob(): For starting a cron job to get push notifications if any
*/

const CronJob = require('cron').CronJob;
const cron_jobs = require('./cron_jobs');

function startPNCronJob() {
  console.log("Creating Push notification Cron Job");
  var pushNotificationJob = new CronJob({
    cronTime: '00 00 10 * * 0-6',
    onTick: function() {
      console.log("Starting push notification cron job");
      cron_jobs.sendPushNotification().then((result) => {
        //Wait for job to finish
      });
    },
    onComplete: function() {
      console.log("Finished notification cron job");
    },
    start: true,
    timeZone: 'Asia/Singapore'
  });
  console.log('pushNotificationJob status:', pushNotificationJob.running);
}

module.exports = {
  startPNCronJob,
}
