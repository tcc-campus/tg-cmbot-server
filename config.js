/* Config for Telegram CM Bot Server */

module.exports = {
  TELEGRAM_API_URL: `https://api.telegram.org/bot${process.env.BOT_TOKEN}`,
  BOT_TOKEN: process.env.BOT_TOKEN,
  WEBHOOK_URL: `${process.env.PUBLIC_URL}/bot${process.env.BOT_TOKEN}`,
  PLATFORM_URL: `${process.env.PLATFORM_URL}/platform${process.env.BOT_TOKEN}`,
  CACHE_DURATION: 600,
  DEV_GROUP_ID: process.env.DEV_GROUP_ID,
  SLACK_WEBHOOK: process.env.SLACK_WEBHOOK,
  POSTGRES: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DATABASE,
    applicationName: process.env.APPLICATION_NAME,
  },
  GOOGLE: {
    serviceAcctId: process.env.GOOGLE_CAL_ACCT,
    key: process.env.GOOGLE_CAL_KEY.replace(/\\n/g, '\n'),
    timezone: 'UTC+08:00',
    calendarId: {
    	'primary': process.env.GOOGLE_CAL_ID,
    },
  }
}
