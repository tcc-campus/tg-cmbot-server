function formatUpcomingMessage(formattedEventList, requestedMonth) {
  console.log("Formatting upcoming message");
  let requestedMonthString = "";
  switch (requestedMonth) {
    case 'this_month':
      requestedMonthString = moment().format('MMMM YYYY');
      break;
    case 'next_month':
      requestedMonthString = moment().add(1, 'month').format('MMMM YYYY');
      break;
    default:
      break;
  }
  return new Promise(function(resolve, reject) {
    let upcomingMessage = "";

    if (formattedEventList.length > 0) {
      upcomingMessage = `Here are the list of Campus events happening in ${requestedMonthString}:\n\n`;

      for(var i = 0; i < formattedEventList.length; i++) {
        upcomingMessage = upcomingMessage + `${i+1}. ${formattedEventList[i].event_name} [${formattedEventList[i].event_date}]\n`
      }

    } else {
      upcomingMessage = `There are no upcoming events in ${requestedMonthString}!`;
    }
    resolve(upcomingMessage);
  });
}

module.exports = {
  formatUpcomingMessage,
}
