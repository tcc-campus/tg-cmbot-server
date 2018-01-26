function formatUpcomingMessage(formattedEventList) {
  console.log("Formatting upcoming message");
  return new Promise(function(resolve, reject) {
    let upcomingMessage = "";

    if (formattedEventList.length > 0) {
      upcomingMessage = "Here are the list of Campus events happening this month:\n\n";

      for(var i = 0; i < formattedEventList.length; i++) {
        upcomingMessage = upcomingMessage + `${i+1}. ${formattedEventList.event_name} [${formattedEventList.event_date}]\n`
      }

    } else {
      upcomingMessage = "There are no upcoming events this month!";
    }
    resolve(upcomingMessage);
  });
}

module.exports = {
  formatUpcomingMessage,
}
