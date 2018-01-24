/* Config for Telegram CM Bot Server */

module.exports = {
  TELEGRAM_API_URL: `https://api.telegram.org/bot${process.env.BOT_TOKEN}`,
  BOT_TOKEN: process.env.BOT_TOKEN,
  WEBHOOK_URL: `${process.env.PUBLIC_URL}/bot${process.env.BOT_TOKEN}`,
  PLATFORM_URL: `${process.env.PLATFORM_URL}/platform${process.env.BOT_TOKEN}`,
  CACHE_DURATION: 600,
}
