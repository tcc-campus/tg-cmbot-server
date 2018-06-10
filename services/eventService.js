/**
 * Service for Campus Events
 */
const async = require('async');
const moment = require('moment-timezone');

const cService = require('../cache/cacheService');
const evtFormatter = require('../formatters/eventFormatter');
const gCaller = require('../apiCallers/googleCaller');

// cache
const CACHE_TTL = 60 * 60 * 24 * 7;

/**
 * Updates Date Cache
 *
 * @param  {[]} eventsData Array of Events
 *
 * @private
 */
async function updateDatesCache(eventsData) {
  const dates = {};
  eventsData.forEach((event) => {
    const month = moment
      .tz(event.event_date_raw, 'Asia/Singapore')
      .startOf('month')
      .format('YYYY-MM');
    if (Object.prototype.hasOwnProperty.call(dates, month)) {
      dates[month].push(event);
    } else {
      dates[month] = [event];
    }
  });

  const waitQueue = () =>
    new Promise((resolve) => {
      const q = async.queue(async (date, callback) => {
        await cService.set(cService.cacheTables.DATES, date, dates[date], CACHE_TTL);
        callback();
      }, 15);
      q.push(Object.keys(dates));

      q.drain = () => {
        console.log('Dates cache updated');
        resolve();
      };
    });

  await waitQueue();
}

/**
 * Updates Event Cache
 *
 * @param  {[]} eventsData Array of Events
 *
 * @private
 */
async function updateEventsCache(eventsData) {
  const waitQueue = () =>
    new Promise((resolve) => {
      const q = async.queue(async (event, callback) => {
        await cService.set(cService.cacheTables.EVENTS, event.id, event, CACHE_TTL);
        callback();
      }, 15);

      q.push(eventsData);

      q.drain = () => {
        console.log('Events cache updated');
        resolve();
      };
    });

  await waitQueue();
}

/**
 * Update events in cache.
 *
 * @public
 */
async function setAll() {
  try {
    console.log('Getting events data from Google Cal');
    const eventsData = await gCaller.getAllEvents();
    const formattedEventsData = evtFormatter.formatEventList(eventsData);
    console.log('Setting events data in cache');
    await Promise.all([
      cService.set(cService.cacheTables.GENERAL, 'event_list', formattedEventsData, CACHE_TTL),
      updateDatesCache(formattedEventsData),
      updateEventsCache(formattedEventsData),
    ]);
  } catch (error) {
    console.log('Error in setting events data in cache', error);
    throw new Error();
  }
}

/**
 * Gets event by ID
 *
 * @param  {string} eventId
 *
 * @public
 *
 * @return {{}}       event Obj
 */
async function getById(eventId) {
  const event = await cService.get(cService.cacheTables.EVENTS, eventId);
  return event;
}

/**
 * Gets list of events by month
 *
 * @param  {string} dateString in YYYY-MM format
 *
 * @public
 *
 * @return {[]}            Array of events
 */
async function getByMonth(dateString) {
  const eventList = await cService.get(cService.cacheTables.DATES, dateString);
  return eventList;
}

/**
 * Gets the whole list of events
 *
 * @public
 *
 * @return [] Array of events
 */
async function getAll() {
  const eventList = await cService.get(cService.cacheTables.GENERAL, 'event_list');
  return eventList;
}

module.exports = {
  setAll,
  getAll,
  getById,
  getByMonth,
};
