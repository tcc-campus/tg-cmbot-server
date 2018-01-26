function formatUpcomingMessage(formattedEventList) {
  let upcomingMessage = "Here are the list of Campus events happening this month:\n\n";
  for(var i = 0; i < formattedEventList.length; i++) {
    upcomingMessage = upcomingMessage + `${i+1}. ${formattedEventList.event_name} [${formattedEventList.event_date}]\n`
  }
  return upcomingMessage;
}

module.exports = {
  formatUpcomingMessage,
}
