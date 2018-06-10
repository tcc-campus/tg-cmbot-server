/* Modules to create and start cron jobs
*   Exported Modules:
*     1. startPNCronJob(): For starting a cron job to get push notifications if any
*/

const { CronJob } = require('cron');
const cronJobs = require('./cronJobs');

function startPNCronJob() {
  console.log('Creating Push notification Cron Job');
  const pushNotificationJob = new CronJob({
    cronTime: '00 00 10 * * 0-6',
    onTick() {
      console.log('Starting push notification cron job');
      cronJobs.sendPushNotification().then((result) => {
        // Wait for job to finish
      });
    },
    onComplete() {
      console.log('Finished notification cron job');
    },
    start: true,
    timeZone: 'Asia/Singapore',
  });
  console.log('pushNotificationJob status:', pushNotificationJob.running);
}

module.exports = {
  startPNCronJob,
};
