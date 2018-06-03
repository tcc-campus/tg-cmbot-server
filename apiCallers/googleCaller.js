const config = require('../config');
const CalendarAPI = require('node-google-calendar');
const moment = require('moment-timezone');

// Sample Execution
// listSingleEventsWithinDateRange("2018-01-01T00:00:00+08:00","2018-12-01T00:00:00+08:00");

function listSingleEventsWithinDateRange(startDateTime, endDateTime) {
  const cal = new CalendarAPI(config.GOOGLE);
  const calendarIdList = config.GOOGLE.calendarId;
  const calendarId = calendarIdList['primary'];
  let eventsArray = [];
	let params = {
		timeMin: startDateTime,
		timeMax: endDateTime,
		singleEvents: true,
		orderBy: 'startTime'
	}
	return new Promise(function(resolve, reject) {
    cal.Events.list(calendarId, params)
  		.then(json => {
  			for (let i = 0; i < json.length; i++) {
  				let event = {
            id: json[i].id,
  					summary: json[i].summary,
            description: json[i].description,
  					location: json[i].location,
  					start: json[i].start,
  					end: json[i].end,
  				};
  				eventsArray.push(event);
  			}
  			resolve(eventsArray);
  		}).catch(err => {
        console.log(err);
  			reject('Error: listSingleEventsWithinDateRange', err.message);
  		});
  });
}

/**
 * Gets all Campus events from past year to next year
 *
 * @public
 *
 * @return {[]}  Array of Events
 */
async function getAllEvents() {
  const startDate = moment().subtract(1, 'year').startOf('month').tz('Asia/Singapore').format();
  const endDate = moment().add(1, 'year').endOf('year').tz('Asia/Singapore').format();
  const eventsData = await listSingleEventsWithinDateRange(startDate, endDate);
  return eventsData;
}

module.exports = {
  listSingleEventsWithinDateRange,
  getAllEvents
}
